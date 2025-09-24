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
    // Connect to Funds_Develop
    const devUrl = Deno.env.get('FUNDS_DEV_SUPABASE_URL')!
    const devServiceKey = Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!
    
    const dev = createClient(devUrl, devServiceKey, {
      auth: { persistSession: false }
    })

    console.log('Testing Funds_Develop database...')

    // Test 1: Check if tables exist
    const tablesCheck = await dev.rpc('query', { 
      query_text: `
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('funds', 'fund_brief_submissions', 'manager_profiles', 'investor_profiles')
        ORDER BY table_name
      ` 
    }).single()

    console.log('Tables check:', tablesCheck)

    // Test 2: Check foreign keys
    const fkCheck = await dev.rpc('query', { 
      query_text: `
        SELECT 
          tc.constraint_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
          AND tc.table_name = 'fund_brief_submissions'
      ` 
    }).single()

    console.log('Foreign keys check:', fkCheck)

    // Test 3: Try the problematic query
    const { data: testData, error: testError } = await dev
      .from('fund_brief_submissions')
      .select(`
        *,
        funds!inner(name),
        manager_profiles!manager_user_id(manager_name, email),
        investor_profiles!investor_user_id(first_name, last_name, email)
      `)
      .limit(1)

    console.log('Query test result:', { data: testData, error: testError })

    // Test 4: Check data in tables
    const { data: fundsData } = await dev.from('funds').select('id, name').limit(3)
    const { data: submissionsData } = await dev.from('fund_brief_submissions').select('*').limit(3)
    const { data: managersData } = await dev.from('manager_profiles').select('user_id, manager_name').limit(3)
    const { data: investorsData } = await dev.from('investor_profiles').select('user_id, first_name, last_name').limit(3)

    return new Response(JSON.stringify({
      status: 'success',
      tests: {
        tables: tablesCheck,
        foreignKeys: fkCheck,
        queryTest: { data: testData, error: testError?.message },
        sampleData: {
          funds: fundsData,
          submissions: submissionsData,
          managers: managersData,
          investors: investorsData
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Test error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})