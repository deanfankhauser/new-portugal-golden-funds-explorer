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

          // Fallback seed for funds when production is empty
          if (table === 'funds') {
            const defaultFunds = [
              { id: 'bluewater-capital-fund', name: 'Bluewater Capital Fund', description: 'Diversified growth with focus on blue-chip equities.', currency: 'EUR', category: 'Equity', manager_name: 'Bluewater Capital', gv_eligible: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'emerald-green-fund', name: 'Emerald Green Fund', description: 'Sustainable investments with strong ESG screening.', currency: 'EUR', category: 'Sustainability', manager_name: 'Emerald Partners', gv_eligible: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'growth-blue-fund', name: 'Growth Blue Fund', description: 'High-growth strategy targeting innovative sectors.', currency: 'EUR', category: 'Growth', manager_name: 'Growth Blue Management', gv_eligible: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'horizon-fund', name: 'Horizon Fund', description: 'Balanced portfolio with risk-adjusted returns.', currency: 'EUR', category: 'Balanced', manager_name: 'Horizon AM', gv_eligible: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'mercurio-fund-ii', name: 'Mercurio Fund II', description: 'Late-stage venture and private equity opportunities.', currency: 'EUR', category: 'Private Equity', manager_name: 'Mercurio Capital', gv_eligible: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'solar-future-fund', name: 'Solar Future Fund', description: 'Renewable energy infrastructure with solar focus.', currency: 'EUR', category: 'Infrastructure', manager_name: 'Solar Future Partners', gv_eligible: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'steady-growth-investment', name: 'Steady Growth Investment', description: 'Conservative strategy aiming for steady returns.', currency: 'EUR', category: 'Income', manager_name: 'Steady Growth AM', gv_eligible: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'ventures-eu-fund', name: 'Ventures EU Fund', description: 'Pan-European early-stage tech ventures.', currency: 'EUR', category: 'Venture Capital', manager_name: 'Ventures EU', gv_eligible: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
            ];

            const { error: seedError } = await devSupabase
              .from('funds')
              .upsert(defaultFunds, { onConflict: 'id' });

            if (!seedError) {
              console.log(`Seeded ${defaultFunds.length} default funds in development`);
              totalCopied += defaultFunds.length;
              results.push({ table, status: 'success', records: defaultFunds.length });
              continue;
            } else {
              console.warn('Failed to seed default funds:', seedError.message);
            }
          }

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