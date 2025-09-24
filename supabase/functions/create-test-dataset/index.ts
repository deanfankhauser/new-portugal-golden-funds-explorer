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
    
    const dev = createClient(devUrl, devServiceKey, { auth: { persistSession: false } })

    console.log('Creating minimal test dataset...')
    
    // Create a minimal fund record for testing
    const testFund = {
      id: 'test-fund-123',
      name: 'Test Fund for Development',
      description: 'A test fund for development purposes',
      manager_name: 'Test Manager',
      currency: 'EUR',
      category: 'Mixed',
      gv_eligible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Clear and insert test fund
    await dev.from('funds').delete().eq('id', 'test-fund-123')
    const { error: fundError } = await dev.from('funds').insert(testFund)
    
    if (fundError) {
      console.log('Fund insert error:', fundError)
      return new Response(JSON.stringify({ error: `Fund creation failed: ${fundError.message}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('✓ Test fund created successfully')

    // Get existing user from manager_profiles
    const { data: managers } = await dev.from('manager_profiles').select('user_id').limit(1)
    const testUserId = managers?.[0]?.user_id

    if (testUserId) {
      // Create a test submission
      const testSubmission = {
        id: 'test-submission-123',
        fund_id: 'test-fund-123',
        user_id: testUserId,
        manager_user_id: testUserId,
        brief_filename: 'test-brief.pdf',
        brief_url: 'https://example.com/test.pdf',
        status: 'pending',
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      await dev.from('fund_brief_submissions').delete().eq('id', 'test-submission-123')
      const { error: submissionError } = await dev.from('fund_brief_submissions').insert(testSubmission)
      
      if (submissionError) {
        console.log('Submission insert error:', submissionError)
      } else {
        console.log('✓ Test submission created successfully')
      }
    }

    // Test the query that was failing
    const { data: testResult, error: testError } = await dev
      .from('fund_brief_submissions')
      .select(`
        *,
        funds!inner(name),
        manager_profiles!manager_user_id(manager_name, email),
        investor_profiles!investor_user_id(first_name, last_name, email)
      `)
      .limit(5)

    return new Response(JSON.stringify({
      status: 'success',
      message: 'Test dataset created and query tested',
      testResult: {
        recordCount: testResult?.length || 0,
        error: testError?.message,
        data: testResult
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Test dataset error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})