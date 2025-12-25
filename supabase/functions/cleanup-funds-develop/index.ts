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
    const prodUrl = Deno.env.get('SUPABASE_URL')!
    const prodServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const devUrl = Deno.env.get('FUNDS_DEV_SUPABASE_URL')!
    const devServiceKey = Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!
    
    const prod = createClient(prodUrl, prodServiceKey, { auth: { persistSession: false } })
    const dev = createClient(devUrl, devServiceKey, { auth: { persistSession: false } })

    console.log('Cleaning and copying valid data...')
    const operations = []

    // Get valid fund IDs from dev
    const { data: devFunds } = await dev.from('funds').select('id')
    const validFundIds = new Set(devFunds?.map(f => f.id) || [])
    
    console.log(`Found ${validFundIds.size} valid fund IDs in Funds_Develop`)

    // Get all submissions from production
    const { data: prodSubmissions, error: fetchError } = await prod.from('fund_brief_submissions').select('*')
    if (fetchError) {
      throw new Error(`Failed to fetch submissions: ${fetchError.message}`)
    }

    // Filter submissions to only include those with valid fund_ids
    const validSubmissions = prodSubmissions?.filter(s => validFundIds.has(s.fund_id)) || []
    
    console.log(`Filtered ${validSubmissions.length} valid submissions out of ${prodSubmissions?.length || 0} total`)

    if (validSubmissions.length > 0) {
      // Clear existing submissions
      await dev.from('fund_brief_submissions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      
      // Insert only valid submissions
      const { error: insertError } = await dev.from('fund_brief_submissions').insert(validSubmissions)
      if (insertError) {
        operations.push({ operation: 'copy_valid_submissions', status: 'error', details: insertError.message })
      } else {
        operations.push({ operation: 'copy_valid_submissions', status: 'success', details: `Copied ${validSubmissions.length} valid submissions` })
      }
    }

    // Fix user relationships
    const { data: needsFixSubmissions } = await dev
      .from('fund_brief_submissions')
      .select('id, user_id, manager_user_id, investor_user_id')
      .or('manager_user_id.is.null,investor_user_id.is.null')

    if (needsFixSubmissions && needsFixSubmissions.length > 0) {
      for (const submission of needsFixSubmissions) {
        const updates: any = {}
        
        const { data: profile } = await dev
          .from('profiles')
          .select('user_id, company_name, manager_name, first_name, last_name')
          .eq('user_id', submission.user_id)
          .maybeSingle()
        
        if (profile) {
          // Check if it's a manager profile (has company_name and manager_name)
          if (profile.company_name && profile.manager_name) {
            updates.manager_user_id = submission.user_id
          }
          // Check if it's an investor profile (has first_name and last_name)
          if (profile.first_name && profile.last_name) {
            updates.investor_user_id = submission.user_id
          }
        }
        
        if (Object.keys(updates).length > 0) {
          await dev.from('fund_brief_submissions').update(updates).eq('id', submission.id)
        }
      }
      operations.push({ operation: 'fix_user_relationships', status: 'success', details: `Fixed ${needsFixSubmissions.length} submissions` })
    }

    // Final test
    const { data: finalTestData, error: finalTestError } = await dev
      .from('fund_brief_submissions')
      .select(`
        *,
        funds!inner(name),
        profiles!fund_brief_submissions_manager_user_id_fkey(manager_name, company_name, email),
        profiles!fund_brief_submissions_investor_user_id_fkey(first_name, last_name, email)
      `)
      .limit(5)

    return new Response(JSON.stringify({
      status: 'success',
      message: 'Data cleanup completed',
      operations,
      finalTest: { 
        data: finalTestData?.length || 0, 
        error: finalTestError?.message,
        sampleData: finalTestData
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: unknown) {
    console.error('Cleanup error:', error)
    const msg = error instanceof Error ? error.message : String(error)
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})