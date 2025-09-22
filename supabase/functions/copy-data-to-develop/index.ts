import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type AnyRow = Record<string, any>

// Load dev schema columns using a stable RPC so we don't rely on rows existing
async function loadDevSchemaColumns(dev: any): Promise<Record<string, string[]>> {
  const columnsByTable: Record<string, string[]> = {}

  // Preferred: security definer RPC available in this project
  const { data, error } = await dev.rpc('get_database_schema_info')
  if (!error && Array.isArray(data)) {
    for (const row of data as Array<{ table_name: string; column_name: string }>) {
      const t = row.table_name
      if (!columnsByTable[t]) columnsByTable[t] = []
      columnsByTable[t].push(row.column_name)
    }
    return columnsByTable
  }

  // Fallback (best-effort): probe known tables
  const probe = async (table: string) => {
    try {
      const { data, error } = await dev.from(table).select('*').limit(1)
      if (!error && data && data[0]) {
        columnsByTable[table] = Object.keys(data[0])
      }
    } catch (_e) {}
  }
  await Promise.all([
    probe('funds'),
    probe('manager_profiles'),
    probe('investor_profiles'),
    probe('admin_users'),
    probe('fund_edit_suggestions'),
    probe('fund_edit_history'),
    probe('saved_funds'),
  ])
  return columnsByTable
}

function filterToColumns(rows: AnyRow[], allowed: string[]): AnyRow[] {
  return rows.map((r) => {
    const out: AnyRow = {}
    for (const c of allowed) if (c in r) out[c] = r[c]
    return out
  })
}

function dedupeByKey<T extends AnyRow>(rows: T[], key: string): T[] {
  const seen = new Set<string>()
  const result: T[] = []
  for (const r of rows) {
    const val = r[key]
    if (val == null) continue
    const k = String(val)
    if (!seen.has(k)) {
      seen.add(k)
      result.push(r)
    }
  }
  return result
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const prodUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const prodKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const devUrl = Deno.env.get('FUNDS_DEV_SUPABASE_URL') ?? ''
    const devKey = Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY') ?? ''

    if (!prodUrl || !prodKey || !devUrl || !devKey) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing required environment variables',
          results: { errors: ['Missing SUPABASE_URL/KEY or FUNDS_DEV_SUPABASE_URL/KEY'] },
          timestamp: new Date().toISOString(),
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const prod = createClient(prodUrl, prodKey)
    const dev = createClient(devUrl, devKey)

    const results: Record<string, number | string[]> = {
      funds: 0,
      manager_profiles: 0,
      investor_profiles: 0,
      admin_users: 0,
      fund_edit_suggestions: 0,
      fund_edit_history: 0,
      saved_funds: 0,
      errors: [] as string[],
    }

    // Load dev schema columns up-front (works even if tables are empty)
    const devSchema = await loadDevSchemaColumns(dev)

    // Generic copy routine per table
    const copyTable = async (table: string, opts?: { uniqueKey?: string }) => {
      try {
        // Ensure destination table exists (in schema map)
        if (!devSchema[table] || devSchema[table].length === 0) {
          ;(results.errors as string[]).push(`Table '${table}' missing in development (schema not found)`) // Saved funds case, etc.
          return
        }

        // Fetch from prod
        const { data: src, error: fetchErr } = await prod.from(table).select('*')
        if (fetchErr) throw new Error(`fetch failed: ${fetchErr.message}`)
        if (!src || src.length === 0) return

        // Filter to dev columns only (avoids schema cache errors like missing 'auditor')
        let filtered = filterToColumns(src, devSchema[table])

        // Optional dedupe by unique key (e.g., manager_profiles.email)
        if (opts?.uniqueKey) filtered = dedupeByKey(filtered, opts.uniqueKey)

        // Attempt to clear destination table (best-effort). If table has 'id', use IS NOT NULL
        const hasId = devSchema[table].includes('id')
        const delQuery = dev.from(table).delete()
        const { error: delErr } = hasId ? delQuery.not('id', 'is', null) : delQuery
        if (delErr) console.log(`Warning clearing ${table}: ${delErr.message}`)

        // Upsert in batches; onConflict id when available; ignore duplicates
        const batchSize = 200
        let inserted = 0
        for (let i = 0; i < filtered.length; i += batchSize) {
          const batch = filtered.slice(i, i + batchSize)
          const { error: upErr } = await dev
            .from(table)
            .upsert(batch, { onConflict: hasId ? 'id' : undefined, ignoreDuplicates: true })
          if (upErr) {
            console.log(`Upsert issue on ${table}, fallback row-by-row: ${upErr.message}`)
            for (const row of batch) {
              const { error: rowErr } = await dev
                .from(table)
                .upsert(row, { onConflict: hasId ? 'id' : undefined, ignoreDuplicates: true })
              if (!rowErr) inserted++
            }
          } else {
            inserted += batch.length
          }
        }

        results[table] = inserted
      } catch (e: any) {
        ;(results.errors as string[]).push(`${table}: ${e.message}`)
      }
    }

    await Promise.all([
      copyTable('funds'),
      copyTable('manager_profiles', { uniqueKey: 'email' }),
      copyTable('investor_profiles'),
      copyTable('admin_users'),
      copyTable('fund_edit_suggestions'),
      copyTable('fund_edit_history'),
      copyTable('saved_funds'),
    ])

    const total = ['funds','manager_profiles','investor_profiles','admin_users','fund_edit_suggestions','fund_edit_history','saved_funds']
      .reduce((sum, t) => sum + (Number(results[t]) || 0), 0)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully copied ${total} records to development database`,
        results,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: err.message, results: { errors: [err.message] }, timestamp: new Date().toISOString() }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})