import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting data copy to Funds_Develop project');

    // Source (current Fund project)
    const sourceSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Destination (Funds_Develop project)
    const destSupabase = createClient(
      Deno.env.get('FUNDS_DEV_SUPABASE_URL')!,
      Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!
    );

    const results = {
      copied_tables: [] as string[],
      errors: [] as string[],
      stats: {} as Record<string, number>
    };

    // Define tables to copy in dependency order
    const tablesToCopy = [
      'admin_users',
      'manager_profiles', 
      'investor_profiles',
      'funds',
      'fund_edit_suggestions',
      'fund_edit_history',
      'account_deletion_requests'
    ];

    for (const tableName of tablesToCopy) {
      try {
        console.log(`📋 Copying table: ${tableName}`);

        // Fetch all data from source
        const { data: sourceData, error: sourceError } = await sourceSupabase
          .from(tableName)
          .select('*');

        if (sourceError) {
          console.error(`❌ Error reading from ${tableName}:`, sourceError);
          results.errors.push(`Failed to read ${tableName}: ${sourceError.message}`);
          continue;
        }

        if (!sourceData || sourceData.length === 0) {
          console.log(`⏭️  Table ${tableName} is empty, skipping`);
          results.stats[tableName] = 0;
          results.copied_tables.push(tableName);
          continue;
        }

        console.log(`📊 Found ${sourceData.length} records in ${tableName}`);

        // Clear destination table first to avoid conflicts
        const { error: deleteError } = await destSupabase
          .from(tableName)
          .delete()
          .neq('id', ''); // Delete all records

        if (deleteError) {
          console.log(`⚠️  Warning: Could not clear ${tableName}: ${deleteError.message}`);
        }

        // Insert data in batches to avoid payload size limits
        const batchSize = 100;
        let totalInserted = 0;

        for (let i = 0; i < sourceData.length; i += batchSize) {
          const batch = sourceData.slice(i, i + batchSize);
          
          const { error: insertError } = await destSupabase
            .from(tableName)
            .insert(batch);

          if (insertError) {
            console.error(`❌ Error inserting batch ${i}-${i + batch.length} into ${tableName}:`, insertError);
            
            // Try inserting records one by one to identify problematic records
            for (const record of batch) {
              const { error: singleError } = await destSupabase
                .from(tableName)
                .insert([record]);
              
              if (singleError) {
                console.error(`❌ Failed to insert record in ${tableName}:`, singleError, record);
              } else {
                totalInserted++;
              }
            }
          } else {
            totalInserted += batch.length;
            console.log(`✅ Inserted batch ${i}-${i + batch.length} into ${tableName}`);
          }
        }

        results.stats[tableName] = totalInserted;
        results.copied_tables.push(tableName);
        console.log(`✅ Completed ${tableName}: ${totalInserted}/${sourceData.length} records`);

      } catch (tableError) {
        console.error(`💥 Unexpected error with table ${tableName}:`, tableError);
        results.errors.push(`Unexpected error with ${tableName}: ${tableError.message}`);
      }
    }

    // Copy storage buckets and policies
    try {
      console.log('📁 Copying storage configuration...');
      
      // Get source buckets
      const { data: sourceBuckets, error: bucketsError } = await sourceSupabase.storage.listBuckets();
      
      if (!bucketsError && sourceBuckets) {
        for (const bucket of sourceBuckets) {
          // Create bucket in destination
          const { error: createBucketError } = await destSupabase.storage.createBucket(bucket.id, {
            public: bucket.public,
            allowedMimeTypes: bucket.allowed_mime_types,
            fileSizeLimit: bucket.file_size_limit
          });
          
          if (createBucketError && !createBucketError.message.includes('already exists')) {
            console.error(`❌ Error creating bucket ${bucket.id}:`, createBucketError);
            results.errors.push(`Failed to create bucket ${bucket.id}: ${createBucketError.message}`);
          } else {
            console.log(`✅ Created/verified bucket: ${bucket.id}`);
          }
        }
      }
    } catch (storageError) {
      console.error('⚠️  Storage copy error:', storageError);
      results.errors.push(`Storage copy error: ${storageError.message}`);
    }

    const summary = {
      success: results.errors.length === 0,
      message: results.errors.length === 0 
        ? `✅ Successfully copied data from ${results.copied_tables.length} tables`
        : `⚠️  Completed with ${results.errors.length} errors`,
      results: results,
      timestamp: new Date().toISOString()
    };

    console.log('🏁 Data copy summary:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: results.errors.length === 0 ? 200 : 207 // 207 = Multi-Status (partial success)
    });

  } catch (error) {
    console.error('💥 Fatal error in copy-data-to-develop function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Data copy failed', 
        details: error.message,
        timestamp: new Date().toISOString()
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});