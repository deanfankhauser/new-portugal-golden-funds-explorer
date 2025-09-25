import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncOperation {
  operation: string;
  status: 'success' | 'error' | 'warning';
  details: string;
  timestamp: string;
  count?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const operations: SyncOperation[] = [];
  let overallSuccess = true;

  try {
    console.log('🚀 Starting full project sync...');
    
    // Initialize Supabase clients
    const prodSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const devSupabase = createClient(
      Deno.env.get('FUNDS_DEV_SUPABASE_URL') ?? '',
      Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('✅ Supabase clients initialized');

    // 1. Sync Auth Users
    console.log('🔄 Syncing auth users...');
    try {
      // Get all users from production
      const { data: prodUsers, error: prodUsersError } = await prodSupabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000
      });

      if (prodUsersError) {
        throw new Error(`Failed to fetch production users: ${prodUsersError.message}`);
      }

      console.log(`Found ${prodUsers.users.length} users in production`);

      let syncedUsers = 0;
      let skippedUsers = 0;

      // Sync each user to development
      for (const user of prodUsers.users) {
        try {
          const { error: createError } = await devSupabase.auth.admin.createUser({
            email: user.email!,
            password: 'temp-password-will-be-reset',
            email_confirm: true,
            user_metadata: user.user_metadata,
            app_metadata: user.app_metadata,
          });

          if (createError && !createError.message.includes('already registered')) {
            console.error(`Failed to create user ${user.email}: ${createError.message}`);
            skippedUsers++;
          } else {
            syncedUsers++;
          }
        } catch (error) {
          console.error(`Error creating user ${user.email}:`, error);
          skippedUsers++;
        }
      }

      operations.push({
        operation: 'sync_auth_users',
        status: 'success',
        details: `Synced ${syncedUsers} users, skipped ${skippedUsers} existing users`,
        timestamp: new Date().toISOString(),
        count: syncedUsers
      });

    } catch (error) {
      console.error('Error syncing auth users:', error);
      operations.push({
        operation: 'sync_auth_users',
        status: 'error',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
      overallSuccess = false;
    }

    // 2. Sync Storage Buckets
    console.log('🔄 Syncing storage buckets...');
    try {
      const { data: prodBuckets, error: prodBucketsError } = await prodSupabase.storage.listBuckets();
      
      if (prodBucketsError) {
        throw new Error(`Failed to list production buckets: ${prodBucketsError.message}`);
      }

      console.log(`Found ${prodBuckets.length} buckets in production`);

      let createdBuckets = 0;
      let existingBuckets = 0;

      for (const bucket of prodBuckets) {
        try {
          const { error: createBucketError } = await devSupabase.storage.createBucket(bucket.id, {
            public: bucket.public,
            allowedMimeTypes: bucket.allowed_mime_types,
            fileSizeLimit: bucket.file_size_limit
          });

          if (createBucketError) {
            if (createBucketError.message.includes('already exists')) {
              existingBuckets++;
              console.log(`Bucket ${bucket.id} already exists`);
            } else {
              throw createBucketError;
            }
          } else {
            createdBuckets++;
            console.log(`Created bucket: ${bucket.id}`);
          }
        } catch (error) {
          console.error(`Failed to create bucket ${bucket.id}:`, error);
        }
      }

      operations.push({
        operation: 'sync_storage_buckets',
        status: 'success',
        details: `Created ${createdBuckets} buckets, ${existingBuckets} already existed`,
        timestamp: new Date().toISOString(),
        count: createdBuckets
      });

    } catch (error) {
      console.error('Error syncing storage buckets:', error);
      operations.push({
        operation: 'sync_storage_buckets',
        status: 'error',
        details: error.message,
        timestamp: new Date().toISOString()
      });
      overallSuccess = false;
    }

    // 3. Sync Storage Files
    console.log('🔄 Syncing storage files...');
    try {
      const { data: buckets } = await prodSupabase.storage.listBuckets();
      let totalFilesCopied = 0;

      for (const bucket of buckets || []) {
        console.log(`Syncing files in bucket: ${bucket.id}`);
        
        try {
          const { data: files, error: listError } = await prodSupabase.storage
            .from(bucket.id)
            .list('', {
              limit: 100,
              offset: 0
            });

          if (listError) {
            console.error(`Failed to list files in bucket ${bucket.id}:`, listError);
            continue;
          }

          console.log(`Found ${files?.length || 0} files in bucket ${bucket.id}`);

          for (const file of files || []) {
            if (file.name && !file.name.endsWith('/')) { // Skip folders
              try {
                // Download file from production
                const { data: fileData, error: downloadError } = await prodSupabase.storage
                  .from(bucket.id)
                  .download(file.name);

                if (downloadError) {
                  console.error(`Failed to download ${file.name}:`, downloadError);
                  continue;
                }

                // Upload file to development
                const { error: uploadError } = await devSupabase.storage
                  .from(bucket.id)
                  .upload(file.name, fileData, {
                    upsert: true,
                    contentType: file.metadata?.mimetype
                  });

                if (uploadError) {
                  console.error(`Failed to upload ${file.name}:`, uploadError);
                } else {
                  totalFilesCopied++;
                  console.log(`Copied file: ${file.name}`);
                }
              } catch (error) {
                console.error(`Error processing file ${file.name}:`, error);
              }
            }
          }
        } catch (error) {
          console.error(`Error processing bucket ${bucket.id}:`, error);
        }
      }

      operations.push({
        operation: 'sync_storage_files',
        status: 'success',
        details: `Copied ${totalFilesCopied} files across all buckets`,
        timestamp: new Date().toISOString(),
        count: totalFilesCopied
      });

    } catch (error) {
      console.error('Error syncing storage files:', error);
      operations.push({
        operation: 'sync_storage_files',
        status: 'error',
        details: error.message,
        timestamp: new Date().toISOString()
      });
      overallSuccess = false;
    }

    // 4. Sync Database Tables Data
    console.log('🔄 Syncing database tables...');
    
    // SAFE TABLES: Only sync non-authentication tables to prevent auth issues
    const safeTables = [
      'funds',
      'fund_edit_suggestions', 
      'fund_brief_submissions',
      'fund_edit_history',
      'saved_funds',
      'account_deletion_requests',
      'admin_activity_log'
    ];
    
    // PROTECTED TABLES: Never sync these as they control authentication
    const protectedTables = ['admin_users', 'manager_profiles', 'investor_profiles'];
    console.log(`⚠️ PROTECTION: Excluding auth tables: ${protectedTables.join(', ')}`);
    console.log(`✅ SYNCING: Safe data tables: ${safeTables.join(', ')}`);

    for (const tableName of safeTables) {
      try {
        console.log(`Syncing table: ${tableName}`);
        
        // Get all data from production table
        const { data: prodData, error: prodError } = await prodSupabase
          .from(tableName)
          .select('*');

        if (prodError) {
          console.error(`Failed to fetch data from ${tableName}:`, prodError);
          operations.push({
            operation: `sync_table_${tableName}`,
            status: 'error',
            details: `Failed to fetch: ${prodError.message}`,
            timestamp: new Date().toISOString()
          });
          continue;
        }

        if (!prodData || prodData.length === 0) {
          operations.push({
            operation: `sync_table_${tableName}`,
            status: 'warning',
            details: 'No data found in production table',
            timestamp: new Date().toISOString(),
            count: 0
          });
          continue;
        }

        // Clear existing data in development table (protect auth-critical tables)
        const protectedTables = ['admin_users', 'manager_profiles', 'investor_profiles'];
        if (!protectedTables.includes(tableName)) {
          console.log(`Clearing existing data from ${tableName}...`);
          const { error: deleteError } = await devSupabase
            .from(tableName)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except non-existent ID

          if (deleteError) {
            console.error(`Failed to clear ${tableName}:`, deleteError);
            // Continue despite clear errors
          }
        } else {
          console.log(`🛡️ PROTECTED: Skipping clear for auth-critical table: ${tableName}`);
        }

        // Insert production data in batches
        const batchSize = 100;
        let insertedRows = 0;

        for (let i = 0; i < prodData.length; i += batchSize) {
          const batch = prodData.slice(i, i + batchSize);
          
          const { error: insertError } = await devSupabase
            .from(tableName)
            .upsert(batch, { onConflict: 'id' });

          if (insertError) {
            console.error(`Failed to insert batch for ${tableName}:`, insertError);
          } else {
            insertedRows += batch.length;
          }
        }

        operations.push({
          operation: `sync_table_${tableName}`,
          status: 'success',
          details: `Synced ${insertedRows} rows`,
          timestamp: new Date().toISOString(),
          count: insertedRows
        });

        console.log(`✅ Synced ${insertedRows} rows for table ${tableName}`);

      } catch (error) {
        console.error(`Error syncing table ${tableName}:`, error);
        operations.push({
          operation: `sync_table_${tableName}`,
          status: 'error',
          details: error.message,
          timestamp: new Date().toISOString()
        });
        overallSuccess = false;
      }
    }

    // 5. Verify sync
    console.log('🔍 Verifying sync...');
    try {
      const verificationResults = [];
      
      for (const tableName of safeTables) {
        const { count: devCount } = await devSupabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        verificationResults.push(`${tableName}: ${devCount} rows`);
      }

      operations.push({
        operation: 'verification',
        status: 'success',
        details: `Tables verified: ${verificationResults.join(', ')}`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error during verification:', error);
      operations.push({
        operation: 'verification',
        status: 'error',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // Generate summary
    const successOps = operations.filter(op => op.status === 'success').length;
    const errorOps = operations.filter(op => op.status === 'error').length;
    const warningOps = operations.filter(op => op.status === 'warning').length;

    const summary = {
      success: overallSuccess && errorOps === 0,
      message: overallSuccess && errorOps === 0 
        ? 'Full project sync completed successfully' 
        : 'Project sync completed with some errors',
      operations,
      summary: {
        total_operations: operations.length,
        successful_operations: successOps,
        failed_operations: errorOps,
        warnings: warningOps
      },
      completed_at: new Date().toISOString()
    };

    console.log('🎉 Full project sync completed!');
    console.log(`Summary: ${successOps} success, ${errorOps} errors, ${warningOps} warnings`);

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
    console.error('Fatal error during sync:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Fatal error during full project sync',
        error: error.message,
        operations,
        timestamp: new Date().toISOString()
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