import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting complete data copy from Funds to Funds_Develop...');

    // Production database client (source - Funds project)
    const prodSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Development database client (destination - Funds_Develop project)
    const devSupabase = createClient(
      Deno.env.get('FUNDS_DEV_SUPABASE_URL')!,
      Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('Connected to both databases');

    // Tables to copy (in dependency order)
    const tablesToCopy = [
      'admin_users',
      'manager_profiles', 
      'investor_profiles',
      'funds',
      'fund_edit_suggestions',
      'fund_edit_history',
      'admin_activity_log',
      'account_deletion_requests'
    ];

    const copyResults: Array<{
      table: string;
      status: 'success' | 'error';
      rowsCopied: number;
      message?: string;
      error?: string;
    }> = [];

    let totalRowsCopied = 0;

    for (const tableName of tablesToCopy) {
      console.log(`Processing table: ${tableName}`);
      
      try {
        // Fetch all data from production Funds project
        const { data: sourceData, error: fetchError } = await prodSupabase
          .from(tableName)
          .select('*');

        if (fetchError) {
          console.error(`Error fetching from ${tableName}:`, fetchError);
          copyResults.push({
            table: tableName,
            status: 'error',
            error: fetchError.message,
            rowsCopied: 0
          });
          continue;
        }

        if (!sourceData || sourceData.length === 0) {
          console.log(`No data found in ${tableName}`);
          copyResults.push({
            table: tableName,
            status: 'success',
            message: 'No data to copy',
            rowsCopied: 0
          });
          continue;
        }

        console.log(`Found ${sourceData.length} rows in ${tableName}`);

        // Clear existing data in Funds_Develop
        const { error: deleteError } = await devSupabase
          .from(tableName)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

        if (deleteError) {
          console.warn(`Warning: Could not clear ${tableName} in Funds_Develop:`, deleteError.message);
        } else {
          console.log(`Cleared existing data in ${tableName}`);
        }

        // Insert data into Funds_Develop project
        const { error: insertError } = await devSupabase
          .from(tableName)
          .insert(sourceData);

        if (insertError) {
          console.error(`Error inserting into ${tableName}:`, insertError);
          copyResults.push({
            table: tableName,
            status: 'error',
            error: insertError.message,
            rowsCopied: 0
          });
        } else {
          console.log(`Successfully copied ${sourceData.length} rows to ${tableName}`);
          totalRowsCopied += sourceData.length;
          copyResults.push({
            table: tableName,
            status: 'success',
            rowsCopied: sourceData.length
          });
        }

      } catch (tableError: any) {
        console.error(`Unexpected error with ${tableName}:`, tableError);
        copyResults.push({
          table: tableName,
          status: 'error',
          error: tableError.message,
          rowsCopied: 0
        });
      }
    }

    console.log('Data copy completed!');

    const summary = {
      total_tables: tablesToCopy.length,
      successful: copyResults.filter(r => r.status === 'success').length,
      failed: copyResults.filter(r => r.status === 'error').length,
      total_rows_copied: totalRowsCopied
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: `Data copy completed! Copied ${totalRowsCopied} total rows from Funds to Funds_Develop`,
        results: copyResults,
        summary
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Data copy failed:', error);
    
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