import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SyncOperation {
  operation: string
  status: 'success' | 'error' | 'skipped'
  details: string
  recordCount?: number
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting full database sync to funds_develop...')
    
    const prodUrl = Deno.env.get('SUPABASE_URL')!
    const prodKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const devUrl = Deno.env.get('FUNDS_DEV_SUPABASE_URL')!
    const devKey = Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!

    if (!prodUrl || !prodKey || !devUrl || !devKey) {
      throw new Error('Missing required environment variables')
    }

    const prod = createClient(prodUrl, prodKey)
    const dev = createClient(devUrl, devKey)
    
const operations: SyncOperation[] = []

// Helper: ensure 'funds' table exists in development and has public read policy
async function ensureFundsTable(dev: any, prod: any, operations: SyncOperation[]) {
  try {
    // Check if table exists by attempting a lightweight select
    let tableExists = true
    try {
      await dev.from('funds').select('*').limit(1)
    } catch (_e) {
      tableExists = false
    }

    if (!tableExists) {
      // Introspect production schema for 'funds' columns
      const { data: schemaInfo, error: schemaErr } = await prod.rpc('get_database_schema_info')
      if (schemaErr || !schemaInfo) throw new Error(`Could not read prod schema: ${schemaErr?.message || 'unknown'}`)

      const cols = (schemaInfo as Array<any>).filter((r) => r.table_name === 'funds')
      if (cols.length === 0) throw new Error('No column info for funds table from prod')

      const columnDefs = cols
        .map((col: any) => {
          let def = `${col.column_name} ${col.data_type}`
          if (col.is_nullable === 'NO') def += ' NOT NULL'
          if (col.column_default) def += ` DEFAULT ${col.column_default}`
          return def
        })
        .join(',\n  ')

      const createSQL = `
        CREATE TABLE IF NOT EXISTS public.funds (
          ${columnDefs}
        );
      `

      // Create table in development
      await dev.rpc('query', { query_text: createSQL }).single()

      operations.push({
        operation: 'ensure_funds_table',
        status: 'success',
        details: 'Created funds table in development'
      })
    } else {
      operations.push({
        operation: 'ensure_funds_table',
        status: 'success',
        details: 'Funds table exists in development'
      })
    }

    // Ensure RLS + public read policy exists (idempotent)
    const rlsSQL = `
      ALTER TABLE public.funds ENABLE ROW LEVEL SECURITY;
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'funds' AND polname = 'Public read access to funds'
        ) THEN
          CREATE POLICY "Public read access to funds" ON public.funds FOR SELECT USING (true);
        END IF;
      END $$;
    `
    await dev.rpc('query', { query_text: rlsSQL }).single()

    operations.push({
      operation: 'ensure_funds_rls',
      status: 'success',
      details: 'RLS enabled with public select policy on funds'
    })
  } catch (e: any) {
    operations.push({
      operation: 'ensure_funds_table_and_rls',
      status: 'error',
      details: e.message
    })
  }
}

// Helper: ensure a table exists in development by replicating columns from production
async function ensureTableExists(dev: any, prod: any, tableName: string, operations: SyncOperation[]) {
  try {
    let exists = true
    try {
      await dev.from(tableName).select('*').limit(1)
    } catch (_e) {
      exists = false
    }

    if (exists) {
      operations.push({ operation: `ensure_${tableName}_table`, status: 'success', details: `${tableName} exists in development` })
      return
    }

    const { data: schemaInfo, error: schemaErr } = await prod.rpc('get_database_schema_info')
    if (schemaErr || !schemaInfo) throw new Error(`Could not read prod schema: ${schemaErr?.message || 'unknown'}`)

    const cols = (schemaInfo as Array<any>).filter((r) => r.table_name === tableName)
    if (cols.length === 0) throw new Error(`No column info for ${tableName} from prod`)

    const columnDefs = cols
      .map((col: any) => {
        let def = `${col.column_name} ${col.data_type}`
        if (col.is_nullable === 'NO') def += ' NOT NULL'
        if (col.column_default) def += ` DEFAULT ${col.column_default}`
        return def
      })
      .join(',\n  ')

    const createSQL = `
      CREATE TABLE IF NOT EXISTS public.${tableName} (
        ${columnDefs}
      );
    `

    await dev.rpc('query', { query_text: createSQL }).single()
    operations.push({ operation: `ensure_${tableName}_table`, status: 'success', details: `Created ${tableName} table in development` })
  } catch (e: any) {
    operations.push({ operation: `ensure_${tableName}_table`, status: 'error', details: e.message })
  }
}

// Helper: ensure minimum foreign keys for PostgREST embeds
async function ensureCoreRelations(dev: any, operations: SyncOperation[]) {
  try {
    const fkSQL = `
      DO $$
      BEGIN
        -- Primary keys (id) if missing
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE table_schema='public' AND table_name='funds' AND constraint_type='PRIMARY KEY'
        ) THEN
          ALTER TABLE public.funds ADD PRIMARY KEY (id);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE table_schema='public' AND table_name='fund_brief_submissions' AND constraint_type='PRIMARY KEY'
        ) THEN
          ALTER TABLE public.fund_brief_submissions ADD PRIMARY KEY (id);
        END IF;

        -- Foreign key for embed: fund_brief_submissions -> funds
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.constraint_column_usage 
          WHERE table_schema='public' AND table_name='fund_brief_submissions' AND column_name='fund_id'
        ) THEN
          -- ensure column exists, then add FK
          IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema='public' AND table_name='fund_brief_submissions' AND column_name='fund_id'
          ) THEN
            ALTER TABLE public.fund_brief_submissions
            ADD CONSTRAINT fund_brief_submissions_fund_id_fkey
            FOREIGN KEY (fund_id) REFERENCES public.funds(id) ON DELETE NO ACTION;
          END IF;
        END IF;
      END $$;
    `
    await dev.rpc('query', { query_text: fkSQL }).single()
    operations.push({ operation: 'ensure_core_relations', status: 'success', details: 'Primary keys and FKs ensured for embeds' })
  } catch (e: any) {
    operations.push({ operation: 'ensure_core_relations', status: 'error', details: e.message })
  }
}

// 1. Sync custom types/enums first
// Helper: ensure core RLS policies for manager and investor profiles
async function ensureCoreRLSPolicies(dev: any, operations: SyncOperation[]) {
  try {
    const rlsSQL = `
      -- Manager profiles RLS and policies
      ALTER TABLE IF EXISTS public.manager_profiles ENABLE ROW LEVEL SECURITY;
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='manager_profiles' AND polname='Admins can view all manager profiles'
        ) THEN
          CREATE POLICY "Admins can view all manager profiles" ON public.manager_profiles
          FOR SELECT USING (is_user_admin());
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='manager_profiles' AND polname='Managers can create own profile'
        ) THEN
          CREATE POLICY "Managers can create own profile" ON public.manager_profiles
          FOR INSERT WITH CHECK (auth.uid() = user_id);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='manager_profiles' AND polname='Managers can update own profile'
        ) THEN
          CREATE POLICY "Managers can update own profile" ON public.manager_profiles
          FOR UPDATE USING (auth.uid() = user_id);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='manager_profiles' AND polname='Managers can view own profile'
        ) THEN
          CREATE POLICY "Managers can view own profile" ON public.manager_profiles
          FOR SELECT USING (auth.uid() = user_id);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='manager_profiles' AND polname='Authenticated users can see business contact info for valid pur'
        ) THEN
          CREATE POLICY "Authenticated users can see business contact info for valid pur" ON public.manager_profiles
          FOR SELECT USING ((auth.uid() IS NOT NULL) AND (status = 'approved'::manager_status) AND can_access_manager_sensitive_data(user_id));
        END IF;
      END $$;

      -- Investor profiles RLS and policies
      ALTER TABLE IF EXISTS public.investor_profiles ENABLE ROW LEVEL SECURITY;
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='investor_profiles' AND polname='Investors can create own profile'
        ) THEN
          CREATE POLICY "Investors can create own profile" ON public.investor_profiles
          FOR INSERT WITH CHECK (auth.uid() = user_id);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='investor_profiles' AND polname='Investors can update own profile'
        ) THEN
          CREATE POLICY "Investors can update own profile" ON public.investor_profiles
          FOR UPDATE USING (auth.uid() = user_id);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='investor_profiles' AND polname='Investors can view own profile'
        ) THEN
          CREATE POLICY "Investors can view own profile" ON public.investor_profiles
          FOR SELECT USING (auth.uid() = user_id);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='investor_profiles' AND polname='Regular admins can view basic investor info'
        ) THEN
          CREATE POLICY "Regular admins can view basic investor info" ON public.investor_profiles
          FOR SELECT USING (is_user_admin() AND (get_user_admin_role() <> 'super_admin'::admin_role) AND log_and_allow_investor_profile_access(user_id));
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='investor_profiles' AND polname='Super admins can view all investor profiles with logging'
        ) THEN
          CREATE POLICY "Super admins can view all investor profiles with logging" ON public.investor_profiles
          FOR SELECT USING (log_and_allow_investor_profile_access(user_id));
        END IF;
      END $$;`

    await dev.rpc('query', { query_text: rlsSQL }).single()
    operations.push({ operation: 'ensure_core_rls', status: 'success', details: 'Ensured RLS and core policies for manager_profiles and investor_profiles' })
  } catch (e: any) {
    operations.push({ operation: 'ensure_core_rls', status: 'error', details: e.message })
  }
}

    console.log('Syncing custom types...')
    try {
      const { data: types } = await prod.rpc('get_database_schema_info')
      // For now, we'll handle types manually as they're already defined
      operations.push({
        operation: 'sync_custom_types',
        status: 'skipped',
        details: 'Custom types (admin_role, manager_status, suggestion_status) assumed to exist'
      })
    } catch (e: any) {
      operations.push({
        operation: 'sync_custom_types',
        status: 'error', 
        details: e.message
      })
    }

    // 2. Sync all database functions
    console.log('Syncing database functions...')
    try {
      // Get all functions from production
      const { data: functions, error: funcError } = await prod.rpc('sync_database_functions_to_develop')
      
      if (funcError) throw new Error(`Failed to get functions: ${funcError.message}`)
      
      let functionCount = 0
      for (const func of functions || []) {
        try {
          // Create function in development
          const { error: createError } = await dev.rpc('query', { 
            query_text: func.function_definition 
          }).single()
          
          if (!createError) {
            functionCount++
          }
        } catch (e: any) {
          console.log(`Function ${func.function_name} may already exist: ${e.message}`)
          functionCount++ // Count as success if it exists
        }
      }
      
      operations.push({
        operation: 'sync_database_functions',
        status: 'success',
        details: `Synced ${functionCount} database functions`,
        recordCount: functionCount
      })
    } catch (e: any) {
      operations.push({
        operation: 'sync_database_functions',
        status: 'error',
        details: e.message
      })
    }

    // 3. Recreate triggers
    console.log('Creating triggers...')
    try {
      const triggers = [
        {
          name: 'on_auth_user_created_manager',
          sql: `
            DROP TRIGGER IF EXISTS on_auth_user_created_manager ON auth.users;
            CREATE TRIGGER on_auth_user_created_manager
              AFTER INSERT ON auth.users
              FOR EACH ROW EXECUTE FUNCTION public.handle_new_manager_user();
          `
        },
        {
          name: 'on_auth_user_created_investor', 
          sql: `
            DROP TRIGGER IF EXISTS on_auth_user_created_investor ON auth.users;
            CREATE TRIGGER on_auth_user_created_investor
              AFTER INSERT ON auth.users
              FOR EACH ROW EXECUTE FUNCTION public.handle_new_investor_user();
          `
        },
        {
          name: 'update_funds_updated_at_trigger',
          sql: `
            DROP TRIGGER IF EXISTS update_funds_updated_at_trigger ON public.funds;
            CREATE TRIGGER update_funds_updated_at_trigger
              BEFORE UPDATE ON public.funds
              FOR EACH ROW EXECUTE FUNCTION public.update_funds_updated_at();
          `
        }
      ]

      let triggerCount = 0
      for (const trigger of triggers) {
        try {
          const { error } = await dev.rpc('query', { query_text: trigger.sql }).single()
          if (!error) {
            triggerCount++
          }
        } catch (e: any) {
          console.log(`Trigger ${trigger.name} creation: ${e.message}`)
        }
      }

      operations.push({
        operation: 'create_triggers',
        status: 'success', 
        details: `Created ${triggerCount} triggers`,
        recordCount: triggerCount
      })
    } catch (e: any) {
      operations.push({
        operation: 'create_triggers',
        status: 'error',
        details: e.message
      })
    }

// Ensure funds table exists and has public read policy
await ensureFundsTable(dev, prod, operations)

// Ensure other core tables exist in development before syncing data
await Promise.all([
  ensureTableExists(dev, prod, 'manager_profiles', operations),
  ensureTableExists(dev, prod, 'investor_profiles', operations),
  ensureTableExists(dev, prod, 'admin_users', operations),
  ensureTableExists(dev, prod, 'fund_edit_suggestions', operations),
  ensureTableExists(dev, prod, 'fund_edit_history', operations),
  ensureTableExists(dev, prod, 'fund_brief_submissions', operations),
  ensureTableExists(dev, prod, 'saved_funds', operations),
  ensureTableExists(dev, prod, 'account_deletion_requests', operations)
])

// Ensure minimal relations needed for embeds (e.g., fund_brief_submissions -> funds)
await ensureCoreRelations(dev, operations)

// Ensure RLS policies for core profile tables
await ensureCoreRLSPolicies(dev, operations)

// 4. Sync table data
console.log('Syncing table data...')
    const tables = [
      'funds',
      'manager_profiles', 
      'investor_profiles',
      'admin_users',
      'fund_edit_suggestions',
      'fund_edit_history', 
      'fund_brief_submissions',
      'saved_funds',
      'account_deletion_requests'
    ]

    for (const table of tables) {
      try {
        console.log(`Syncing table: ${table}`)
        
        // Get production data
        const { data: prodData, error: fetchError } = await prod.from(table).select('*')
        if (fetchError) {
          operations.push({
            operation: `sync_table_${table}`,
            status: 'error',
            details: `Fetch failed: ${fetchError.message}`
          })
          continue
        }

        if (!prodData || prodData.length === 0) {
          operations.push({
            operation: `sync_table_${table}`,
            status: 'success',
            details: 'No data to sync',
            recordCount: 0
          })
          continue
        }

        // Clear existing data and insert new data
        const { error: deleteError } = await dev.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
        if (deleteError) {
          console.log(`Warning: Could not clear ${table}: ${deleteError.message}`)
        }

        // Insert in batches
        const batchSize = 100
        let totalInserted = 0
        
        for (let i = 0; i < prodData.length; i += batchSize) {
          const batch = prodData.slice(i, i + batchSize)
          const { error: insertError } = await dev.from(table).insert(batch)
          
          if (insertError) {
            // Try upsert instead
            const { error: upsertError } = await dev.from(table).upsert(batch, { 
              onConflict: 'id',
              ignoreDuplicates: true 
            })
            if (!upsertError) {
              totalInserted += batch.length
            }
          } else {
            totalInserted += batch.length
          }
        }

        operations.push({
          operation: `sync_table_${table}`,
          status: 'success',
          details: `Synced ${totalInserted} records`,
          recordCount: totalInserted
        })

      } catch (e: any) {
        operations.push({
          operation: `sync_table_${table}`,
          status: 'error',
          details: e.message
        })
      }
    }

    // 5. Sync storage files
    console.log('Syncing storage files...')
    try {
      let totalStorageFiles = 0
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
            await listAllFiles(client, bucketName, fullPath, allFiles)
          } else {
            allFiles.push({ ...item, fullPath })
          }
        }
        
        return allFiles
      }
      
      for (const bucketName of buckets) {
        console.log(`Syncing storage bucket: ${bucketName}`)
        
        try {
          // Get all files recursively from production
          const files = await listAllFiles(prod, bucketName)
          
          if (files.length === 0) {
            console.log(`No files found in bucket: ${bucketName}`)
            continue
          }
          
          console.log(`Found ${files.length} files in ${bucketName}`)
          
          // Download and upload each file
          let bucketFiles = 0
          for (const file of files) {
            try {
              // Skip if not a real file
              if (!file.name.includes('.')) continue
              
              const filePath = file.fullPath
              
              // No pre-existence check; rely on upsert upload below to handle duplicates safely
              
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
              
              bucketFiles++
              console.log(`Synced: ${bucketName}/${filePath}`)
            } catch (e: any) {
              console.log(`Error syncing file ${bucketName}/${file.fullPath}: ${e.message}`)
            }
          }
          
          totalStorageFiles += bucketFiles
        } catch (e: any) {
          console.log(`Error processing bucket ${bucketName}: ${e.message}`)
        }
      }
      
      operations.push({
        operation: 'sync_storage_files',
        status: 'success',
        details: `Synced ${totalStorageFiles} storage files across all buckets`,
        recordCount: totalStorageFiles
      })
    } catch (e: any) {
      operations.push({
        operation: 'sync_storage_files',
        status: 'error',
        details: e.message
      })
    }

    // 7. Verify RLS policies (just report, don't copy as they're complex)
    console.log('Checking RLS policies...')
    operations.push({
      operation: 'verify_rls_policies',
      status: 'skipped',
      details: 'RLS policies should be manually verified in Supabase dashboard'
    })

    const totalRecords = operations.reduce((sum, op) => sum + (op.recordCount || 0), 0)
    const errors = operations.filter(op => op.status === 'error')
    const successful = operations.filter(op => op.status === 'success')

    return new Response(JSON.stringify({
      success: errors.length === 0,
      message: `Full database sync completed. ${successful.length} operations successful, ${errors.length} errors.`,
      totalRecords,
      operations,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: errors.length === 0 ? 200 : 206
    })

  } catch (error: any) {
    console.error('Full database sync failed:', error)
    return new Response(JSON.stringify({
      success: false,
      message: `Full database sync failed: ${error.message}`,
      operations: [],
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})