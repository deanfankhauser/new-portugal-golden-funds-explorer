import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DatabaseRecord {
  [key: string]: any;
}

// Helper function to check if table exists
async function tableExists(client: any, tableName: string): Promise<boolean> {
  try {
    const { error } = await client.from(tableName).select('*').limit(1);
    return !error;
  } catch {
    return false;
  }
}

// Helper function to get table columns
async function getTableColumns(client: any, tableName: string): Promise<string[]> {
  try {
    const { data, error } = await client.from(tableName).select('*').limit(1);
    if (error || !data || data.length === 0) {
      return [];
    }
    return Object.keys(data[0]);
  } catch {
    return [];
  }
}

// Helper function to filter data based on available columns
function filterDataByColumns(data: any[], availableColumns: string[]): any[] {
  return data.map(row => {
    const filteredRow: any = {};
    availableColumns.forEach(column => {
      if (column in row) {
        filteredRow[column] = row[column];
      }
    });
    return filteredRow;
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting data copy to development database...');

    // Initialize production Supabase client
    const prodSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Initialize development Supabase client
    const devSupabase = createClient(
      Deno.env.get('FUNDS_DEV_SUPABASE_URL') ?? '',
      Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const results = {
      funds: 0,
      manager_profiles: 0,
      investor_profiles: 0,
      admin_users: 0,
      fund_edit_suggestions: 0,
      fund_edit_history: 0,
      saved_funds: 0,
      errors: [] as string[]
    };

    const tablesToCopy = [
      'funds',
      'manager_profiles', 
      'investor_profiles',
      'admin_users',
      'fund_edit_suggestions',
      'fund_edit_history',
      'saved_funds'
    ];

    for (const tableName of tablesToCopy) {
      try {
        console.log(`Processing table: ${tableName}`);

        // Check if destination table exists
        const destTableExists = await tableExists(devSupabase, tableName);
        if (!destTableExists) {
          console.log(`Table ${tableName} does not exist in development database, skipping...`);
          results.errors.push(`Table '${tableName}' does not exist in development database`);
          continue;
        }

        // Fetch data from production
        const { data: sourceData, error: fetchError } = await prodSupabase
          .from(tableName)
          .select('*');

        if (fetchError) {
          throw new Error(`Failed to fetch ${tableName}: ${fetchError.message}`);
        }

        if (!sourceData || sourceData.length === 0) {
          console.log(`No data found in ${tableName}`);
          continue;
        }

        console.log(`Found ${sourceData.length} records in ${tableName}`);

        // Get available columns in development table
        const devColumns = await getTableColumns(devSupabase, tableName);
        if (devColumns.length === 0) {
          console.log(`Could not determine columns for ${tableName}, skipping...`);
          results.errors.push(`Could not determine schema for '${tableName}'`);
          continue;
        }

        // Filter data to only include columns that exist in development
        const filteredData = filterDataByColumns(sourceData, devColumns);

        // Clear existing data first (using truncate-like approach)
        const { error: deleteError } = await devSupabase
          .from(tableName)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

        if (deleteError) {
          console.log(`Warning: Could not clear existing data from ${tableName}: ${deleteError.message}`);
        }

        // Insert data in batches to handle large datasets
        const batchSize = 100;
        let inserted = 0;

        for (let i = 0; i < filteredData.length; i += batchSize) {
          const batch = filteredData.slice(i, i + batchSize);
          
          const { error: insertError } = await devSupabase
            .from(tableName)
            .upsert(batch, { 
              onConflict: 'id',
              ignoreDuplicates: false 
            });

          if (insertError) {
            console.error(`Error inserting batch for ${tableName}:`, insertError);
            // Try individual inserts for this batch
            for (const record of batch) {
              const { error: singleInsertError } = await devSupabase
                .from(tableName)
                .upsert(record, { 
                  onConflict: 'id',
                  ignoreDuplicates: true 
                });
              
              if (!singleInsertError) {
                inserted++;
              }
            }
          } else {
            inserted += batch.length;
          }
        }

        results[tableName] = inserted;
        console.log(`Successfully copied ${inserted} records for ${tableName}`);

      } catch (error) {
        console.error(`Error copying ${tableName}:`, error);
        results.errors.push(`${tableName}: ${error.message}`);
      }
    }

    const totalRecords = results.funds + results.manager_profiles + results.investor_profiles + 
                        results.admin_users + results.fund_edit_suggestions + results.fund_edit_history + 
                        results.saved_funds;

    console.log(`Data copy completed. Total records copied: ${totalRecords}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully copied ${totalRecords} records to development database`,
        results,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error) {
    console.error('Error in copy-data-to-develop function:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});