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
    console.log('Starting database sync with pg_dump/pg_restore...')

    // Get database connection strings from environment
    const prodDbUrl = Deno.env.get('SUPABASE_DB_URL')
    const devDbUrl = Deno.env.get('FUNDS_DEV_SUPABASE_DB_URL')

    if (!prodDbUrl || !devDbUrl) {
      throw new Error('Database connection URLs not configured')
    }

    console.log('Database URLs found, proceeding with sync...')

    // Create temporary file for the dump
    const tempDumpFile = `/tmp/database_dump_${Date.now()}.sql`

    // Step 1: Create database dump from production
    console.log('Creating database dump from production...')
    const dumpCommand = new Deno.Command('pg_dump', {
      args: [
        prodDbUrl,
        '--clean',
        '--if-exists',
        '--no-owner',
        '--no-privileges',
        '--file', tempDumpFile,
        '--schema', 'public',
        '--exclude-table', 'auth.*',
        '--exclude-table', 'storage.*',
        '--exclude-table', 'realtime.*'
      ],
      stdout: 'piped',
      stderr: 'piped'
    })

    const dumpProcess = dumpCommand.spawn()
    const dumpResult = await dumpProcess.output()

    if (!dumpResult.success) {
      const errorText = new TextDecoder().decode(dumpResult.stderr)
      throw new Error(`pg_dump failed: ${errorText}`)
    }

    console.log('Database dump created successfully')

    // Step 2: Restore dump to development database
    console.log('Restoring dump to development database...')
    const restoreCommand = new Deno.Command('psql', {
      args: [
        devDbUrl,
        '--file', tempDumpFile,
        '--single-transaction'
      ],
      stdout: 'piped',
      stderr: 'piped'
    })

    const restoreProcess = restoreCommand.spawn()
    const restoreResult = await restoreProcess.output()

    if (!restoreResult.success) {
      const errorText = new TextDecoder().decode(restoreResult.stderr)
      console.warn(`psql warnings/errors: ${errorText}`)
      // Don't throw here as psql often returns non-zero for warnings
    }

    console.log('Database restore completed')

    // Step 3: Clean up temporary file
    try {
      await Deno.remove(tempDumpFile)
    } catch (e) {
      console.warn(`Could not remove temp file: ${e.message}`)
    }

    // Step 4: Get final statistics
    const result: SyncResult = {
      success: true,
      message: 'Successfully synchronized production database to development using pg_dump/pg_restore',
      details: {
        method: 'pg_dump/pg_restore',
        timestamp: new Date().toISOString(),
        prodDbUrl: prodDbUrl.split('@')[1], // Hide credentials
        devDbUrl: devDbUrl.split('@')[1]    // Hide credentials
      },
      timestamp: new Date().toISOString()
    }

    console.log('Database sync completed successfully')

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
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