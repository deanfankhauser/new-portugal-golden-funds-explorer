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

// Create missing tables in development
async function createMissingTable(dev: any, prod: any, tableName: string): Promise<boolean> {
  try {
    // Get table structure from production using SQL query
    const { data: tableInfo, error: tableError } = await prod.rpc('get_database_schema_info')
    if (tableError || !tableInfo) return false
    
    const tableColumns = tableInfo.filter((row: any) => row.table_name === tableName)
    if (tableColumns.length === 0) return false
    
    // Build CREATE TABLE statement
    const columnDefs = tableColumns.map((col: any) => {
      let colDef = `${col.column_name} ${col.data_type}`
      if (col.is_nullable === 'NO') colDef += ' NOT NULL'
      if (col.column_default) colDef += ` DEFAULT ${col.column_default}`
      return colDef
    }).join(',\n  ')
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.${tableName} (
        ${columnDefs}
      );
    `
    
    // Execute table creation
    const { error: createError } = await dev.rpc('execute_sql', { query: createTableSQL })
    if (createError) {
      console.log(`Failed to create table ${tableName}: ${createError.message}`)
      return false
    }
    
    console.log(`Successfully created table ${tableName}`)
    return true
  } catch (e: any) {
    console.log(`Error creating table ${tableName}: ${e.message}`)
    return false
  }
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
      storage_files: 0,
      errors: [] as string[],
    }

    // Load dev schema columns up-front (works even if tables are empty)
    const devSchema = await loadDevSchemaColumns(dev)

    // Generic copy routine per table
    const copyTable = async (table: string, opts?: { uniqueKey?: string }) => {
      try {
        // Ensure destination table exists (in schema map)
        if (!devSchema[table] || devSchema[table].length === 0) {
          console.log(`Table '${table}' missing in development, attempting to create...`)
          
          // Try to create the missing table
          const created = await createMissingTable(dev, prod, table)
          if (created) {
            // Reload schema to get the new table columns
            const updatedSchema = await loadDevSchemaColumns(dev)
            if (updatedSchema[table] && updatedSchema[table].length > 0) {
              devSchema[table] = updatedSchema[table]
              console.log(`Table '${table}' created successfully with ${devSchema[table].length} columns`)
            } else {
              ;(results.errors as string[]).push(`Table '${table}' created but schema not found`)
              return
            }
          } else {
            ;(results.errors as string[]).push(`Table '${table}' missing in development and could not be created`)
            return
          }
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

    // Copy storage files
    const copyStorageFiles = async () => {
      try {
        console.log('Starting storage file copy...')
        let copiedFiles = 0
        
        // List of buckets to sync
        const buckets = ['fund-briefs-pending', 'fund-briefs', 'fund-logos', 'profile-photos']
        
        // Helper function to recursively list all files in a folder
        const listAllFiles = async (client: any, bucketName: string, folder = '', allFiles: any[] = []): Promise<any[]> => {
          const { data: files, error } = await client.storage
            .from(bucketName)
            .list(folder, { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } })
          
          if (error) {
            console.log(`Error listing ${bucketName}/${folder}: ${error.message}`)
            return allFiles
          }
          
          if (!files) return allFiles
          
          for (const item of files) {
            const fullPath = folder ? `${folder}/${item.name}` : item.name
            
            // Folders typically have no id and no metadata in Supabase Storage list()
            const isFolder = !item.id && !item.metadata
            if (isFolder) {
              // Recurse into folder
              await listAllFiles(client, bucketName, fullPath, allFiles)
            } else {
              // This is a file
              allFiles.push({ ...item, fullPath })
            }
          }
          
          return allFiles
        }
        
        for (const bucketName of buckets) {
          console.log(`Copying files from bucket: ${bucketName}`)
          
          try {
            // Get all files recursively
            const files = await listAllFiles(prod, bucketName)
            
            if (files.length === 0) {
              console.log(`No files found in bucket: ${bucketName}`)
              continue
            }
            
            console.log(`Found ${files.length} files in ${bucketName}`)
            
            // Download and upload each file
            for (const file of files) {
              try {
                // Skip if not a real file
                if (!file.name.includes('.')) continue
                
                const filePath = file.fullPath
                
                // Download from production
                const { data: fileData, error: downloadError } = await prod.storage
                  .from(bucketName)
                  .download(filePath)
                
                if (downloadError) {
                  console.log(`Failed to download ${bucketName}/${filePath}: ${downloadError.message}`)
                  continue
                }
                
                // Upload to development (create bucket if needed)
                let uploadError: any = null
                try {
                  const { error } = await dev.storage
                    .from(bucketName)
                    .upload(filePath, fileData, {
                      upsert: true,
                      cacheControl: '3600'
                    })
                  uploadError = error
                } catch (e: any) {
                  uploadError = e
                }
                
                if (uploadError) {
                  const msg = String(uploadError.message || uploadError).toLowerCase()
                  if (msg.includes('bucket not found')) {
                    try {
                      await dev.storage.createBucket(bucketName, {
                        public: bucketName === 'fund-logos' || bucketName === 'profile-photos'
                      })
                      const { error: retryErr } = await dev.storage
                        .from(bucketName)
                        .upload(filePath, fileData, { upsert: true, cacheControl: '3600' })
                      if (retryErr) throw retryErr
                    } catch (ce: any) {
                      console.log(`Failed to create bucket or upload ${bucketName}/${filePath}: ${ce.message}`)
                      continue
                    }
                  } else {
                    console.log(`Failed to upload ${bucketName}/${filePath}: ${uploadError.message || uploadError}`)
                    continue
                  }
                }
                
                copiedFiles++
                console.log(`Copied: ${bucketName}/${filePath}`)
              } catch (e: any) {
                console.log(`Error copying file ${bucketName}/${file.fullPath}: ${e.message}`)
              }
            }
          } catch (e: any) {
            console.log(`Error processing bucket ${bucketName}: ${e.message}`)
            ;(results.errors as string[]).push(`Bucket ${bucketName}: ${e.message}`)
          }
        }
        
        results.storage_files = copiedFiles
        console.log(`Total storage files copied: ${copiedFiles}`)
      } catch (e: any) {
        ;(results.errors as string[]).push(`Storage copy failed: ${e.message}`)
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
      copyStorageFiles(),
    ])

    const total = ['funds','manager_profiles','investor_profiles','admin_users','fund_edit_suggestions','fund_edit_history','saved_funds','storage_files']
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