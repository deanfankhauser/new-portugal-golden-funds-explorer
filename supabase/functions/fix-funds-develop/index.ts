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
    // Connect to both databases
    const prodUrl = Deno.env.get('SUPABASE_URL')!
    const prodServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const devUrl = Deno.env.get('FUNDS_DEV_SUPABASE_URL')!
    const devServiceKey = Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!
    
    const prod = createClient(prodUrl, prodServiceKey, {
      auth: { persistSession: false }
    })
    
    const dev = createClient(devUrl, devServiceKey, {
      auth: { persistSession: false }
    })

    console.log('Starting direct data fix for Funds_Develop...')
    const operations = []

    // Step 1: Copy all funds data
    console.log('Copying funds data...')
    const { data: fundsData, error: fundsError } = await prod.from('funds').select('*')
    if (fundsError) {
      throw new Error(`Failed to fetch funds: ${fundsError.message}`)
    }

    if (fundsData && fundsData.length > 0) {
      // Clear existing funds and insert new data
      await dev.from('funds').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      
      const { error: insertFundsError } = await dev.from('funds').insert(fundsData)
      if (insertFundsError) {
        console.log('Funds insert error:', insertFundsError)
        operations.push({ operation: 'copy_funds', status: 'error', details: insertFundsError.message })
      } else {
        operations.push({ operation: 'copy_funds', status: 'success', details: `Copied ${fundsData.length} funds` })
      }
    }

    // Step 2: Copy fund_brief_submissions data
    console.log('Copying fund_brief_submissions data...')
    const { data: submissionsData, error: submissionsError } = await prod.from('fund_brief_submissions').select('*')
    if (submissionsError) {
      throw new Error(`Failed to fetch submissions: ${submissionsError.message}`)
    }

    if (submissionsData && submissionsData.length > 0) {
      // Clear existing submissions and insert new data
      await dev.from('fund_brief_submissions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      
      const { error: insertSubmissionsError } = await dev.from('fund_brief_submissions').insert(submissionsData)
      if (insertSubmissionsError) {
        console.log('Submissions insert error:', insertSubmissionsError)
        operations.push({ operation: 'copy_submissions', status: 'error', details: insertSubmissionsError.message })
      } else {
        operations.push({ operation: 'copy_submissions', status: 'success', details: `Copied ${submissionsData.length} submissions` })
      }
    }

    // Step 3: Test the problematic query again
    console.log('Testing fixed query...')
    const { data: testData, error: testError } = await dev
      .from('fund_brief_submissions')
      .select(`
        *,
        funds!inner(name),
        manager_profiles!manager_user_id(manager_name, email),
        investor_profiles!investor_user_id(first_name, last_name, email)
      `)
      .limit(1)

    if (testError) {
      operations.push({ operation: 'test_query', status: 'error', details: testError.message })
    } else {
      operations.push({ operation: 'test_query', status: 'success', details: 'Query works correctly' })
    }

    // Step 4: Update manager_user_id and investor_user_id if needed
    console.log('Fixing user_id relationships...')
    const { data: needsFixSubmissions } = await dev
      .from('fund_brief_submissions')
      .select('id, user_id, manager_user_id, investor_user_id')
      .or('manager_user_id.is.null,investor_user_id.is.null')

    if (needsFixSubmissions && needsFixSubmissions.length > 0) {
      for (const submission of needsFixSubmissions) {
        const updates: any = {}
        
        // Check if user is a manager
        const { data: managerCheck } = await dev
          .from('manager_profiles')
          .select('user_id')
          .eq('user_id', submission.user_id)
          .single()
        
        if (managerCheck) {
          updates.manager_user_id = submission.user_id
        }
        
        // Check if user is an investor
        const { data: investorCheck } = await dev
          .from('investor_profiles')
          .select('user_id')
          .eq('user_id', submission.user_id)
          .single()
        
        if (investorCheck) {
          updates.investor_user_id = submission.user_id
        }
        
        if (Object.keys(updates).length > 0) {
          await dev
            .from('fund_brief_submissions')
            .update(updates)
            .eq('id', submission.id)
        }
      }
      operations.push({ operation: 'fix_relationships', status: 'success', details: `Fixed ${needsFixSubmissions.length} submissions` })
    }

    return new Response(JSON.stringify({
      status: 'success',
      message: 'Funds_Develop database fixed',
      operations,
      finalTest: { data: testData, error: testError?.message }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Fix error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})