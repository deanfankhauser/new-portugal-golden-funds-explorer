import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    console.log('Starting development database data copy...');

    // Get environment variables
    const devSupabaseUrl = Deno.env.get('FUNDS_DEV_SUPABASE_URL');
    const devSupabaseKey = Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY');
    
    const prodSupabaseUrl = Deno.env.get('SUPABASE_URL');
    const prodSupabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!devSupabaseUrl || !devSupabaseKey || !prodSupabaseUrl || !prodSupabaseKey) {
      throw new Error('Missing required environment variables for database setup');
    }

    // Create Supabase clients
    const prodSupabase = createClient(prodSupabaseUrl, prodSupabaseKey);
    const devSupabase = createClient(devSupabaseUrl, devSupabaseKey);

    console.log('Created Supabase clients');

    // Copy data from production to development
    const tables = [
      'funds',
      'manager_profiles', 
      'investor_profiles',
      'admin_users',
      'fund_edit_suggestions',
      'fund_edit_history',
      'admin_activity_log',
      'account_deletion_requests'
    ];

    let copiedRecords = 0;
    const results = [];

    for (const table of tables) {
      try {
        console.log(`Copying data from ${table}...`);
        
        // Get data from production
        const { data: prodData, error: prodError } = await prodSupabase
          .from(table)
          .select('*');

        if (prodError) {
          console.error(`Error reading from production ${table}:`, prodError);
          results.push({ table, status: 'error', error: prodError.message, records: 0 });
          continue;
        }

        if (prodData && prodData.length > 0) {
          // Insert data into development
          const { error: devError } = await devSupabase
            .from(table)
            .upsert(prodData, { onConflict: 'id' });

          if (devError) {
            console.error(`Error inserting into development ${table}:`, devError);
            results.push({ table, status: 'error', error: devError.message, records: 0 });
          } else {
            copiedRecords += prodData.length;
            console.log(`Successfully copied ${prodData.length} records to ${table}`);
            results.push({ table, status: 'success', records: prodData.length });
          }
        } else {
          console.log(`No data to copy for ${table}`);
          results.push({ table, status: 'success', records: 0 });
        }
      } catch (tableError) {
        console.error(`Unexpected error processing ${table}:`, tableError);
        results.push({ table, status: 'error', error: tableError.message, records: 0 });
      }
    }

    const result = {
      success: true,
      message: `Data copy completed. Copied ${copiedRecords} total records.`,
      copiedRecords,
      tableResults: results
    };

    console.log('Setup completed:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in setup-develop-schema function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});