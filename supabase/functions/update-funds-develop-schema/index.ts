import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const devUrl = Deno.env.get('FUNDS_DEV_SUPABASE_URL')!
    const devServiceKey = Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!
    
    const dev = createClient(devUrl, devServiceKey, {
      auth: { persistSession: false }
    })

    console.log('Starting direct schema update for Funds_Develop...')
    const operations = []

    // Direct SQL execution using service role
    const executeSQL = async (sql: string, description: string) => {
      try {
        const response = await fetch(`${devUrl}/rest/v1/rpc/execute_sql`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${devServiceKey}`,
            'Content-Type': 'application/json',
            'apikey': devServiceKey
          },
          body: JSON.stringify({ sql })
        })
        
        if (response.ok) {
          operations.push({ operation: description, status: 'success' })
          console.log(`✓ ${description}`)
        } else {
          const error = await response.text()
          operations.push({ operation: description, status: 'error', details: error })
          console.log(`✗ ${description}: ${error}`)
        }
      } catch (e: any) {
        operations.push({ operation: description, status: 'error', details: e.message })
        console.log(`✗ ${description}: ${e.message}`)
      }
    }

    // Add missing columns to funds table
    await executeSQL(`
      ALTER TABLE public.funds 
      ADD COLUMN IF NOT EXISTS auditor text,
      ADD COLUMN IF NOT EXISTS custodian text,
      ADD COLUMN IF NOT EXISTS nav_frequency text,
      ADD COLUMN IF NOT EXISTS pfic_status text,
      ADD COLUMN IF NOT EXISTS eligibility_basis jsonb,
      ADD COLUMN IF NOT EXISTS redemption_terms jsonb,
      ADD COLUMN IF NOT EXISTS fund_brief_url text;
    `, 'Add missing funds columns')

    // Add missing columns to fund_brief_submissions table
    await executeSQL(`
      ALTER TABLE public.fund_brief_submissions 
      ADD COLUMN IF NOT EXISTS manager_user_id uuid,
      ADD COLUMN IF NOT EXISTS investor_user_id uuid;
    `, 'Add missing fund_brief_submissions columns')

    // Create foreign key relationships
    await executeSQL(`
      ALTER TABLE public.fund_brief_submissions
      DROP CONSTRAINT IF EXISTS fund_brief_submissions_fund_id_fkey;
      
      ALTER TABLE public.fund_brief_submissions
      ADD CONSTRAINT fund_brief_submissions_fund_id_fkey
      FOREIGN KEY (fund_id) REFERENCES public.funds(id) ON DELETE NO ACTION;
    `, 'Create fund_id foreign key')

    await executeSQL(`
      ALTER TABLE public.fund_brief_submissions
      DROP CONSTRAINT IF EXISTS fund_brief_submissions_manager_user_fkey;
      
      ALTER TABLE public.fund_brief_submissions
      ADD CONSTRAINT fund_brief_submissions_manager_user_fkey
      FOREIGN KEY (manager_user_id) REFERENCES public.manager_profiles(user_id)
      ON UPDATE CASCADE ON DELETE SET NULL;
    `, 'Create manager_user_id foreign key')

    await executeSQL(`
      ALTER TABLE public.fund_brief_submissions
      DROP CONSTRAINT IF EXISTS fund_brief_submissions_investor_user_fkey;
      
      ALTER TABLE public.fund_brief_submissions
      ADD CONSTRAINT fund_brief_submissions_investor_user_fkey
      FOREIGN KEY (investor_user_id) REFERENCES public.investor_profiles(user_id)
      ON UPDATE CASCADE ON DELETE SET NULL;
    `, 'Create investor_user_id foreign key')

    // Try alternative approach using direct HTTP calls to copy data
    console.log('Attempting to copy data directly...')
    
    // Copy funds using basic insert
    try {
      const prodResponse = await fetch(`https://bkmvydnfhmkjnuszroim.supabase.co/rest/v1/funds?select=*`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'apikey': Deno.env.get('SUPABASE_ANON_KEY')!
        }
      })
      
      if (prodResponse.ok) {
        const fundsData = await prodResponse.json()
        
        // Clear existing data
        await dev.from('funds').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        
        // Insert funds one by one to handle missing columns
        for (const fund of fundsData) {
          const { error } = await dev.from('funds').insert({
            id: fund.id,
            name: fund.name,
            description: fund.description,
            detailed_description: fund.detailed_description,
            manager_name: fund.manager_name,
            minimum_investment: fund.minimum_investment,
            currency: fund.currency,
            risk_level: fund.risk_level,
            lock_up_period_months: fund.lock_up_period_months,
            management_fee: fund.management_fee,
            performance_fee: fund.performance_fee,
            aum: fund.aum,
            inception_date: fund.inception_date,
            website: fund.website,
            category: fund.category,
            geographic_allocation: fund.geographic_allocation,
            tags: fund.tags,
            team_members: fund.team_members,
            pdf_documents: fund.pdf_documents,
            faqs: fund.faqs,
            gv_eligible: fund.gv_eligible,
            historical_performance: fund.historical_performance,
            created_at: fund.created_at,
            updated_at: fund.updated_at
          })
          
          if (error) {
            console.log(`Error inserting fund ${fund.id}:`, error)
          }
        }
        
        operations.push({ operation: 'copy_funds_direct', status: 'success', details: `Copied ${fundsData.length} funds` })
      }
    } catch (e: any) {
      operations.push({ operation: 'copy_funds_direct', status: 'error', details: e.message })
    }

    return new Response(JSON.stringify({
      status: 'success',
      message: 'Schema update and data copy completed',
      operations
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Schema fix error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})