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
    console.log('🚀 Starting complete migration from Funds to Funds_Develop...');

    // Production database (source - this project)
    const prodSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Development database (destination - Funds_Develop)
    const devSupabase = createClient(
      Deno.env.get('FUNDS_DEV_SUPABASE_URL')!,
      Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('✅ Connected to both databases');

    const migrationResults: Array<{
      step: string;
      status: 'success' | 'error' | 'warning';
      details: string;
      records?: number;
    }> = [];

    // Step 1: Create funds table if missing
    console.log('📋 Step 1: Ensuring funds table exists in development...');
    try {
      const createFundsTableSQL = `
        CREATE TABLE IF NOT EXISTS public.funds (
          id text PRIMARY KEY,
          name text NOT NULL,
          description text,
          detailed_description text,
          website text,
          tags text[],
          currency text DEFAULT 'EUR',
          minimum_investment bigint,
          expected_return_min numeric,
          expected_return_max numeric,
          lock_up_period_months integer,
          management_fee numeric,
          performance_fee numeric,
          aum bigint,
          inception_date date,
          geographic_allocation jsonb,
          team_members jsonb,
          pdf_documents jsonb,
          faqs jsonb,
          gv_eligible boolean DEFAULT false,
          risk_level text,
          manager_name text,
          category text,
          last_modified_by uuid,
          version integer DEFAULT 1,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
        
        ALTER TABLE public.funds ENABLE ROW LEVEL SECURITY;
        
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funds' AND policyname = 'Public read access to funds') THEN
            CREATE POLICY "Public read access to funds" ON public.funds FOR SELECT USING (true);
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funds' AND policyname = 'Admins can manage funds') THEN
            CREATE POLICY "Admins can manage funds" ON public.funds FOR ALL USING (is_user_admin());
          END IF;
        END $$;
      `;

      // Execute schema creation using raw SQL
      const { error: schemaError } = await devSupabase.rpc('execute_sql', { 
        query: createFundsTableSQL 
      });

      if (schemaError) {
        console.warn('⚠️ Schema creation warning (may already exist):', schemaError.message);
        migrationResults.push({
          step: 'Create funds table',
          status: 'warning',
          details: `Schema warning: ${schemaError.message}`
        });
      } else {
        migrationResults.push({
          step: 'Create funds table',
          status: 'success',
          details: 'Funds table and policies created/verified'
        });
      }
    } catch (schemaErr: any) {
      migrationResults.push({
        step: 'Create funds table',
        status: 'error',
        details: `Schema error: ${schemaErr.message}`
      });
    }

    // Step 2: Copy all table data
    console.log('📊 Step 2: Copying all table data...');
    
    const tablesToMigrate = [
      'funds',
      'manager_profiles',
      'investor_profiles',
      'admin_users',
      'fund_edit_suggestions',
      'fund_edit_history',
      'admin_activity_log',
      'account_deletion_requests'
    ];

    let totalRecordsCopied = 0;

    for (const tableName of tablesToMigrate) {
      console.log(`📋 Migrating table: ${tableName}`);
      
      try {
        // Fetch all data from production
        const { data: sourceData, error: fetchError } = await prodSupabase
          .from(tableName)
          .select('*');

        if (fetchError) {
          console.error(`❌ Error fetching ${tableName}:`, fetchError);
          migrationResults.push({
            step: `Copy ${tableName}`,
            status: 'error',
            details: fetchError.message,
            records: 0
          });
          continue;
        }

        if (!sourceData || sourceData.length === 0) {
          console.log(`ℹ️ No data in ${tableName}`);
          
          // Add default funds if funds table is empty
          if (tableName === 'funds') {
            const defaultFunds = [
              { id: 'bluewater-capital-fund', name: 'Bluewater Capital Fund', description: 'Diversified growth with focus on blue-chip equities.', currency: 'EUR', category: 'Equity', manager_name: 'Bluewater Capital', gv_eligible: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'emerald-green-fund', name: 'Emerald Green Fund', description: 'Sustainable investments with strong ESG screening.', currency: 'EUR', category: 'Sustainability', manager_name: 'Emerald Partners', gv_eligible: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'growth-blue-fund', name: 'Growth Blue Fund', description: 'High-growth strategy targeting innovative sectors.', currency: 'EUR', category: 'Growth', manager_name: 'Growth Blue Management', gv_eligible: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'horizon-fund', name: 'Horizon Fund', description: 'Balanced portfolio with risk-adjusted returns.', currency: 'EUR', category: 'Balanced', manager_name: 'Horizon AM', gv_eligible: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'mercurio-fund-ii', name: 'Mercurio Fund II', description: 'Late-stage venture and private equity opportunities.', currency: 'EUR', category: 'Private Equity', manager_name: 'Mercurio Capital', gv_eligible: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
            ];

            const { error: seedError } = await devSupabase
              .from('funds')
              .upsert(defaultFunds, { onConflict: 'id' });

            if (!seedError) {
              console.log(`🌱 Seeded ${defaultFunds.length} default funds`);
              totalRecordsCopied += defaultFunds.length;
              migrationResults.push({
                step: `Copy ${tableName}`,
                status: 'success',
                details: 'Seeded with default fund data',
                records: defaultFunds.length
              });
            } else {
              migrationResults.push({
                step: `Copy ${tableName}`,
                status: 'error',
                details: `Seed error: ${seedError.message}`,
                records: 0
              });
            }
          } else {
            migrationResults.push({
              step: `Copy ${tableName}`,
              status: 'success',
              details: 'No data to copy',
              records: 0
            });
          }
          continue;
        }

        console.log(`📊 Found ${sourceData.length} records in ${tableName}`);

        // Upsert to development database
        const { error: upsertError } = await devSupabase
          .from(tableName)
          .upsert(sourceData, { onConflict: 'id' });

        if (upsertError) {
          console.error(`❌ Error upserting ${tableName}:`, upsertError);
          migrationResults.push({
            step: `Copy ${tableName}`,
            status: 'error',
            details: upsertError.message,
            records: 0
          });
        } else {
          console.log(`✅ Successfully migrated ${sourceData.length} records to ${tableName}`);
          totalRecordsCopied += sourceData.length;
          migrationResults.push({
            step: `Copy ${tableName}`,
            status: 'success',
            details: `Successfully copied ${sourceData.length} records`,
            records: sourceData.length
          });
        }

      } catch (tableError: any) {
        console.error(`💥 Unexpected error with ${tableName}:`, tableError);
        migrationResults.push({
          step: `Copy ${tableName}`,
          status: 'error',
          details: `Unexpected error: ${tableError.message}`,
          records: 0
        });
      }
    }

    // Step 3: Information about edge functions
    console.log('⚙️ Step 3: Edge functions information...');
    migrationResults.push({
      step: 'Edge functions migration',
      status: 'success',
      details: 'Edge functions must be deployed manually to Funds_Develop project. Required functions: send-notification-email, notify-super-admins, delete-account, setup-develop-schema'
    });

    console.log('🎉 Migration completed!');

    const summary = {
      totalSteps: migrationResults.length,
      successful: migrationResults.filter(r => r.status === 'success').length,
      warnings: migrationResults.filter(r => r.status === 'warning').length,
      errors: migrationResults.filter(r => r.status === 'error').length,
      totalRecordsCopied
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: `🎉 Migration completed! Copied ${totalRecordsCopied} total records to Funds_Develop`,
        summary,
        migrationResults,
        nextSteps: [
          '1. Verify data in Funds_Develop project tables',
          '2. Deploy edge functions to Funds_Develop manually',
          '3. Test functionality in development environment',
          '4. Update environment variables in your app if needed'
        ]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('💥 Migration failed:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: `Migration failed: ${error.message}`,
        details: 'Check function logs for detailed error information'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});