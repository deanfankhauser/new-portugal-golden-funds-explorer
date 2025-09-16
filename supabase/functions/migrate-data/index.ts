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
    console.log('Starting data migration process...');

    // Production database client (service role)
    const prodSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Development database client (service role required to bypass RLS)
    const devSupabase = createClient(
      Deno.env.get('FUNDS_DEV_SUPABASE_URL')!,
      Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('Connected to both databases');

    // Tables to migrate (in order to respect foreign key dependencies)
    const tablesToMigrate = [
      'admin_users',
      'manager_profiles', 
      'investor_profiles',
      'funds',
      'fund_edit_suggestions',
      'fund_edit_history',
      'admin_activity_log',
      'account_deletion_requests'
    ];

    const migrationResults: Array<{
      table: string;
      status: 'success' | 'error';
      rowsProcessed: number;
      message?: string;
      error?: string;
    }> = [];

    for (const tableName of tablesToMigrate) {
      console.log(`Migrating table: ${tableName}`);
      
      try {
        // Fetch all data from production
        const { data: prodData, error: fetchError } = await prodSupabase
          .from(tableName)
          .select('*');

        if (fetchError) {
          console.error(`Error fetching from ${tableName}:`, fetchError);
          migrationResults.push({
            table: tableName,
            status: 'error',
            error: fetchError.message,
            rowsProcessed: 0
          });
          continue;
        }

        if (!prodData || prodData.length === 0) {
          console.log(`No data found in ${tableName}`);
          migrationResults.push({
            table: tableName,
            status: 'success',
            message: 'No data to migrate',
            rowsProcessed: 0
          });
          continue;
        }

        console.log(`Found ${prodData.length} rows in ${tableName}`);

        // Clear existing data in development (optional - remove if you want to append)
        const { error: deleteError } = await devSupabase
          .from(tableName)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (deleteError) {
          console.warn(`Warning: Could not clear ${tableName}:`, deleteError.message);
        }

        // Insert data into development database
        const { error: insertError } = await devSupabase
          .from(tableName)
          .insert(prodData);

        if (insertError) {
          console.error(`Error inserting into ${tableName}:`, insertError);
          migrationResults.push({
            table: tableName,
            status: 'error',
            error: insertError.message,
            rowsProcessed: prodData.length
          });
        } else {
          console.log(`Successfully migrated ${prodData.length} rows to ${tableName}`);
          migrationResults.push({
            table: tableName,
            status: 'success',
            rowsProcessed: prodData.length
          });
        }

      } catch (tableError: any) {
        console.error(`Unexpected error with ${tableName}:`, tableError);
        migrationResults.push({
          table: tableName,
          status: 'error',
          error: tableError.message,
          rowsProcessed: 0
        });
      }
    }

    console.log('Migration completed!');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data migration completed',
        results: migrationResults,
        summary: {
          total_tables: tablesToMigrate.length,
          successful: migrationResults.filter(r => r.status === 'success').length,
          failed: migrationResults.filter(r => r.status === 'error').length,
          total_rows: migrationResults.reduce((sum, r) => sum + r.rowsProcessed, 0)
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Migration failed:', error);
    
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