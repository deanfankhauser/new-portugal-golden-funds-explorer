import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting complete data sync from production to development...');

    // Production database (source)
    const prodSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Development database (destination) 
    const devSupabase = createClient(
      Deno.env.get('FUNDS_DEV_SUPABASE_URL')!,
      Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('Connected to both databases');

    // All tables to sync in dependency order
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

    const results: Array<{
      table: string;
      status: 'success' | 'error';
      records: number;
      error?: string;
    }> = [];

    let totalCopied = 0;

    for (const table of tablesToSync) {
      console.log(`Syncing table: ${table}`);
      
      try {
        // Fetch all data from production
        const { data: sourceData, error: fetchError } = await prodSupabase
          .from(table)
          .select('*');

        if (fetchError) {
          console.error(`Error fetching ${table}:`, fetchError);
          results.push({
            table,
            status: 'error',
            records: 0,
            error: fetchError.message
          });
          continue;
        }

        if (!sourceData || sourceData.length === 0) {
          console.log(`No data in ${table}`);
          results.push({
            table,
            status: 'success', 
            records: 0
          });
          continue;
        }

        console.log(`Found ${sourceData.length} records in ${table}`);

        // Upsert data to development (insert or update existing)
        const { error: upsertError } = await devSupabase
          .from(table)
          .upsert(sourceData, { onConflict: 'id' });

        if (upsertError) {
          console.error(`Error upserting ${table}:`, upsertError);
          results.push({
            table,
            status: 'error',
            records: 0,
            error: upsertError.message
          });
        } else {
          console.log(`Successfully synced ${sourceData.length} records to ${table}`);
          totalCopied += sourceData.length;
          results.push({
            table,
            status: 'success',
            records: sourceData.length
          });
        }

      } catch (error: any) {
        console.error(`Unexpected error with ${table}:`, error);
        results.push({
          table,
          status: 'error',
          records: 0,
          error: error.message
        });
      }
    }

    console.log(`Data sync completed! Copied ${totalCopied} total records`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Data sync completed. Copied ${totalCopied} total records.`,
        copiedRecords: totalCopied,
        tableResults: results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Data sync failed:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: 'Check function logs for more details'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});