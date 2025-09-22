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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting complete database sync (schema + data)...')

    // Initialize Supabase clients
    const prodUrl = Deno.env.get('SUPABASE_URL')!
    const prodKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const devUrl = Deno.env.get('FUNDS_DEV_SUPABASE_URL')!
    const devKey = Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!

    const prod = createClient(prodUrl, prodKey)
    const dev = createClient(devUrl, devKey)

    console.log('Supabase clients initialized')

    // Step 1: Get complete schema from production
    console.log('Fetching database schema from production...')
    const { data: schemaData, error: schemaError } = await prod.rpc('get_database_schema_info')
    if (schemaError) throw new Error(`Failed to get schema: ${schemaError.message}`)

    // Group columns by table
    const tableSchemas: Record<string, any[]> = {}
    for (const row of schemaData) {
      if (!tableSchemas[row.table_name]) {
        tableSchemas[row.table_name] = []
      }
      tableSchemas[row.table_name].push(row)
    }

    console.log(`Found ${Object.keys(tableSchemas).length} tables in production`)

    // Step 2: Drop and recreate tables in development
    for (const tableName of Object.keys(tableSchemas)) {
      console.log(`Recreating table: ${tableName}`)
      
      // Drop table if exists
      const { error: dropError } = await dev.rpc('execute_sql', { 
        query: `DROP TABLE IF EXISTS public.${tableName} CASCADE;` 
      })
      if (dropError) console.warn(`Warning dropping table ${tableName}: ${dropError.message}`)

      // Build CREATE TABLE statement
      const columns = tableSchemas[tableName]
      const columnDefs = columns.map((col: any) => {
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

      // Create table
      const { error: createError } = await dev.rpc('execute_sql', { query: createTableSQL })
      if (createError) {
        console.error(`Failed to create table ${tableName}: ${createError.message}`)
        continue
      }
      
      console.log(`Table ${tableName} recreated successfully`)
    }

    // Step 3: Copy all data
    const results: Record<string, number> = {}
    const errors: string[] = []

    const tablesToSync = Object.keys(tableSchemas)
    
    for (const table of tablesToSync) {
      try {
        console.log(`Syncing data for table: ${table}`)

        // Fetch all data from production
        const { data: prodData, error: fetchError } = await prod.from(table).select('*')
        if (fetchError) {
          errors.push(`Failed to fetch from ${table}: ${fetchError.message}`)
          continue
        }

        if (!prodData || prodData.length === 0) {
          results[table] = 0
          continue
        }

        // Clear development table
        const { error: deleteError } = await dev.from(table).delete().neq('id', '')
        if (deleteError) console.warn(`Warning clearing ${table}: ${deleteError.message}`)

        // Insert data in batches
        const batchSize = 100
        let totalInserted = 0
        
        for (let i = 0; i < prodData.length; i += batchSize) {
          const batch = prodData.slice(i, i + batchSize)
          const { error: insertError } = await dev.from(table).insert(batch)
          
          if (insertError) {
            errors.push(`Failed to insert batch in ${table}: ${insertError.message}`)
            continue
          }
          
          totalInserted += batch.length
        }

        results[table] = totalInserted
        console.log(`Synced ${totalInserted} records for ${table}`)

      } catch (error: any) {
        errors.push(`Error syncing ${table}: ${error.message}`)
        console.error(`Error syncing ${table}:`, error.message)
      }
    }

    const totalRecords = Object.values(results).reduce((sum, count) => sum + count, 0)
    
    const result: SyncResult = {
      success: errors.length === 0,
      message: errors.length === 0 
        ? `Successfully synchronized complete database: ${totalRecords} records across ${Object.keys(results).length} tables`
        : `Partial sync completed with ${errors.length} errors: ${totalRecords} records across ${Object.keys(results).length} tables`,
      details: {
        method: 'schema-recreation + data-copy',
        results,
        errors,
        tablesProcessed: Object.keys(results).length,
        totalRecords
      },
      timestamp: new Date().toISOString()
    }

    console.log('Database sync completed')

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: errors.length === 0 ? 200 : 206
      }
    )

  } catch (error: any) {
    console.error('Database sync failed:', error.message)

    const errorResult: SyncResult = {
      success: false,
      message: `Database sync failed: ${error.message}`,
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(errorResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})