import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SyncResult {
  success: boolean
  message: string
  details?: any
  timestamp: string
}

// Tables we care about syncing (public data + admin tables used by app)
const TABLES: string[] = [
  'account_deletion_requests',
  'admin_activity_log',
  'admin_users',
  'fund_edit_history',
  'fund_edit_suggestions',
  'funds',
  'investor_profiles',
  'manager_profiles',
  'saved_funds',
  'security_audit_access_log',
  'security_audit_log',
]

// Helper: chunk an array
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

// Try to load the dev schema using a safe RPC (defined in this project); fall back gracefully if unavailable
async function loadDevSchema(dev: any): Promise<Record<string, Set<string>>> {
  try {
    const { data, error } = await dev.rpc('get_database_schema_info')
    if (error || !Array.isArray(data)) return {}
    const map: Record<string, Set<string>> = {}
    for (const row of data as any[]) {
      const t = String(row.table_name)
      const c = String(row.column_name)
      if (!map[t]) map[t] = new Set<string>()
      map[t].add(c)
    }
    return map
  } catch (_e) {
    return {}
  }
}

// Filter each row to allowed columns only (keeping id when present)
function filterRows<T extends Record<string, any>>(rows: T[], allowed: Set<string>): T[] {
  if (!rows.length) return rows
  const out: T[] = []
  for (const r of rows) {
    const o: Record<string, any> = {}
    for (const k of Object.keys(r)) {
      if (allowed.has(k)) o[k] = r[k]
    }
    out.push(o as T)
  }
  return out
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting safe data sync (no schema changes)...')

    const prodUrl = Deno.env.get('SUPABASE_URL')!
    const prodKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const devUrl = Deno.env.get('FUNDS_DEV_SUPABASE_URL')!
    const devKey = Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!

    const prod = createClient(prodUrl, prodKey)
    const dev = createClient(devUrl, devKey)

    // Load dev schema to know which columns exist; skip schema creation entirely
    const devSchema = await loadDevSchema(dev)
    console.log(`Loaded dev schema for ${Object.keys(devSchema).length} tables (if 0, RPC unavailable)`)

    const results: Record<string, number> = {}
    const errors: string[] = []

    // Sync each table via UPSERT (no deletion) to avoid duplicate key errors
    for (const table of TABLES) {
      try {
        console.log(`Syncing table: ${table}`)

        // 1) Read production data
        const { data: prodData, error: fetchError } = await prod.from(table).select('*')
        if (fetchError) {
          errors.push(`Fetch ${table}: ${fetchError.message}`)
          continue
        }

        if (!prodData || prodData.length === 0) {
          results[table] = 0
          continue
        }

        // 2) Check if table exists in dev schema
        if (!devSchema[table] || devSchema[table].size === 0) {
          console.warn(`Table ${table} not found in dev schema, skipping`)
          errors.push(`Table ${table}: not found in development database`)
          results[table] = 0
          continue
        }

        // 3) Filter columns to only those that exist in dev
        const allowed = devSchema[table]
        const filtered = filterRows(prodData as any[], allowed)

        // Ensure primary key column is included if present in dev
        const onConflict = allowed.has('id') ? 'id' : undefined

        // 3) Upsert in batches to avoid duplicates and avoid delete() that caused UUID comparison errors
        const batchSize = 100
        let total = 0
        for (const batch of chunk(filtered, batchSize)) {
          if (batch.length === 0) continue
          const query = onConflict
            ? dev.from(table).upsert(batch, { onConflict })
            : dev.from(table).upsert(batch)
          const { error: upsertError } = await query
          if (upsertError) {
            // If table is missing in dev, skip with clear error; if columns mismatch, report nicely
            errors.push(`Upsert ${table}: ${upsertError.message}`)
            // No retry loop here to keep things predictable and fast
            total = results[table] ?? total
            break
          }
          total += batch.length
        }
        results[table] = total
        console.log(`Synced ${total} records for ${table}`)
      } catch (e: any) {
        errors.push(`Error ${table}: ${e?.message ?? String(e)}`)
      }
    }

    const totalRecords = Object.values(results).reduce((a, b) => a + (b || 0), 0)
    const success = errors.length === 0

    const result: SyncResult = {
      success,
      message: success
        ? `Successfully synchronized data: ${totalRecords} records across ${Object.keys(results).length} tables`
        : `Partial sync completed with ${errors.length} errors: ${totalRecords} records across ${Object.keys(results).length} tables`,
      details: {
        method: 'data-only upsert (no schema changes)',
        results,
        errors,
        tablesProcessed: Object.keys(results).length,
        totalRecords,
      },
      timestamp: new Date().toISOString(),
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: success ? 200 : 206,
    })
  } catch (error: any) {
    console.error('Database sync failed:', error?.message ?? error)
    const errorResult: SyncResult = {
      success: false,
      message: `Database sync failed: ${error?.message ?? String(error)}`,
      timestamp: new Date().toISOString(),
    }
    return new Response(JSON.stringify(errorResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
