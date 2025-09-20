import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SyncResult {
  operation: string;
  status: 'success' | 'error' | 'warning';
  details: string;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting full production to develop sync...');
    
    const results: SyncResult[] = [];
    const startTime = new Date().toISOString();

    // Initialize Supabase clients
    const prodSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const devSupabase = createClient(
      Deno.env.get('FUNDS_DEV_SUPABASE_URL')!,
      Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('✅ Supabase clients initialized');
    results.push({
      operation: 'client_initialization',
      status: 'success',
      details: 'Both production and develop Supabase clients initialized successfully',
      timestamp: new Date().toISOString()
    });

    // 1. SCHEMA/TRIGGERS SYNC (manual due to platform constraints)
    console.log('📋 Step 1: Schema & triggers sync - manual');
    results.push({
      operation: 'schema_sync',
      status: 'warning',
      details: 'Schema, tables (create-if-missing), triggers, and RLS policies must be synced via CLI/migrations. information_schema is not exposed via REST.',
      timestamp: new Date().toISOString()
    });

    // NOTE: Security audit tables (security_audit_log, security_audit_access_log) are 
    // intentionally NOT synced as they contain sensitive system information and have 
    // RLS policies set to 'false' (system-only access)

    // 2. SYNC STORAGE BUCKETS
    console.log('🪣 Step 2: Syncing storage buckets...');
    
    try {
      // Get storage buckets from production
      const { data: prodBuckets, error: bucketsError } = await prodSupabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('❌ Error fetching storage buckets:', bucketsError);
        results.push({
          operation: 'fetch_storage_buckets',
          status: 'error',
          details: `Failed to fetch storage buckets: ${bucketsError.message}`,
          timestamp: new Date().toISOString()
        });
      } else if (prodBuckets && prodBuckets.length > 0) {
        for (const bucket of prodBuckets) {
          try {
            // Create bucket in develop (will ignore if exists)
            const { error: createError } = await devSupabase.storage.createBucket(bucket.id, {
              public: bucket.public,
              allowedMimeTypes: bucket.allowed_mime_types,
              fileSizeLimit: bucket.file_size_limit
            });
            
            if (createError && !createError.message.includes('already exists')) {
              console.error(`❌ Error creating bucket ${bucket.id}:`, createError);
              results.push({
                operation: `create_bucket_${bucket.id}`,
                status: 'error',
                details: `Failed to create bucket: ${createError.message}`,
                timestamp: new Date().toISOString()
              });
            } else {
              console.log(`✅ Storage bucket ${bucket.id} ready in develop`);
              results.push({
                operation: `create_bucket_${bucket.id}`,
                status: 'success',
                details: `Storage bucket ${bucket.id} created/verified in develop`,
                timestamp: new Date().toISOString()
              });
            }
          } catch (error) {
            console.error(`❌ Error processing bucket ${bucket.id}:`, error);
            results.push({
              operation: `create_bucket_${bucket.id}`,
              status: 'error',
              details: `Error processing bucket: ${error.message}`,
              timestamp: new Date().toISOString()
            });
          }
        }
      } else {
        console.log('ℹ️  No storage buckets found in production');
        results.push({
          operation: 'sync_storage_buckets',
          status: 'success',
          details: 'No storage buckets to sync',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('❌ Error syncing storage buckets:', error);
      results.push({
        operation: 'sync_storage_buckets',
        status: 'error',
        details: `Error syncing storage buckets: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }

    // 3. SYNC TABLE DATA
    console.log('📊 Step 3: Syncing table data...');
    
    const tablesToSync = [
      'funds',
      'manager_profiles', 
      'investor_profiles',
      'admin_users',
      'fund_edit_suggestions',
      'fund_edit_history',
      'admin_activity_log',
      'account_deletion_requests'
    ];

    for (const tableName of tablesToSync) {
      try {
        console.log(`🔄 Syncing data for table: ${tableName}`);
        
        // Get all data from production
        const { data: prodData, error: prodDataError } = await prodSupabase
          .from(tableName)
          .select('*');

        if (prodDataError) {
          console.error(`❌ Error fetching data from ${tableName}:`, prodDataError);
          results.push({
            operation: `fetch_data_${tableName}`,
            status: 'error',
            details: `Failed to fetch data from ${tableName}: ${prodDataError.message}`,
            timestamp: new Date().toISOString()
          });
          continue;
        }

        if (!prodData || prodData.length === 0) {
          console.log(`ℹ️  No data found in ${tableName}`);
          results.push({
            operation: `sync_data_${tableName}`,
            status: 'success',
            details: `No data to sync for ${tableName}`,
            timestamp: new Date().toISOString()
          });
          continue;
        }

        // Clear existing data in develop
        const { error: deleteError } = await devSupabase
          .from(tableName)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

        if (deleteError) {
          console.error(`❌ Error clearing ${tableName} in develop:`, deleteError);
        }

        // Insert production data into develop
        const { error: insertError } = await devSupabase
          .from(tableName)
          .insert(prodData);

        if (insertError) {
          console.error(`❌ Error inserting data into ${tableName}:`, insertError);
          results.push({
            operation: `sync_data_${tableName}`,
            status: 'error',
            details: `Failed to insert data into ${tableName}: ${insertError.message}`,
            timestamp: new Date().toISOString()
          });
        } else {
          console.log(`✅ Successfully synced ${prodData.length} records to ${tableName}`);
          results.push({
            operation: `sync_data_${tableName}`,
            status: 'success',
            details: `Synced ${prodData.length} records to ${tableName}`,
            timestamp: new Date().toISOString()
          });
        }

      } catch (error) {
        console.error(`❌ Error syncing ${tableName}:`, error);
        results.push({
          operation: `sync_data_${tableName}`,
          status: 'error',
          details: `Error syncing ${tableName}: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }
    }

    // 4. DATABASE FUNCTIONS SYNC (manual)
    console.log('🔧 Step 4: Database functions sync - manual');
    results.push({
      operation: 'sync_database_functions',
      status: 'warning',
      details: 'Database functions must be migrated via SQL migrations/CLI. information_schema is not accessible via REST.',
      timestamp: new Date().toISOString()
    });

    // 5. SYNC EDGE FUNCTIONS
    console.log('🚀 Step 5: Preparing edge functions sync...');
    
    const edgeFunctions = [
      'delete-account',
      'notify-super-admins',
      'send-notification-email',
      'send-password-reset',
      'sync-production-to-develop'
    ];

    results.push({
      operation: 'sync_edge_functions',
      status: 'warning',
      details: `Edge functions (${edgeFunctions.join(', ')}) need to be deployed manually via CLI to Funds_Develop`,
      timestamp: new Date().toISOString()
    });

    // 6. CONFIG.TOML SYNC INSTRUCTIONS
    console.log('⚙️  Step 6: Config.toml sync instructions...');
    
    results.push({
      operation: 'sync_config_toml',
      status: 'warning',
      details: 'Config.toml from Funds project should be replicated to Funds_Develop with updated project_id',
      timestamp: new Date().toISOString()
    });

    // Generate summary
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const warningCount = results.filter(r => r.status === 'warning').length;

    const summary = {
      sync_started_at: startTime,
      sync_completed_at: new Date().toISOString(),
      total_operations: results.length,
      successful_operations: successCount,
      errors: errorCount,
      warnings: warningCount,
      results: results,
      manual_steps_required: [
        'Deploy edge functions to Funds_Develop using Supabase CLI',
        'Replicate config.toml structure with correct project_id for Funds_Develop',
        'Deploy database functions and triggers to Funds_Develop',
        'Verify RLS policies are correctly applied in Funds_Develop'
      ],
      cli_commands: [
        'supabase login',
        'supabase link --project-ref fgwmkjivosjvvslbrvxe',
        'supabase functions deploy',
        'supabase db push'
      ]
    };

    console.log('📊 Production to Develop sync completed:', summary);

    return new Response(
      JSON.stringify(summary),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('💥 Unexpected error during sync:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Sync operation failed', 
        details: error.message,
        suggestion: 'Check the logs and ensure all environment variables are set correctly'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});