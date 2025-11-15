import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BackfillResult {
  fundManagerId: string;
  userId: string;
  fundId: string;
  fundManagerName: string;
  profileId: string | null;
  profileCompanyName: string | null;
  matched: boolean;
  assignmentCreated: boolean;
  error?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    console.log('Starting backfill process...');

    // Get all active fund_managers assignments
    const { data: fundManagers, error: fmError } = await supabase
      .from('fund_managers')
      .select('id, user_id, fund_id, status')
      .eq('status', 'active');

    if (fmError) {
      throw new Error(`Failed to fetch fund managers: ${fmError.message}`);
    }

    console.log(`Found ${fundManagers?.length || 0} active fund manager assignments`);

    const results: BackfillResult[] = [];

    for (const fm of fundManagers || []) {
      const result: BackfillResult = {
        fundManagerId: fm.id,
        userId: fm.user_id,
        fundId: fm.fund_id,
        fundManagerName: '',
        profileId: null,
        profileCompanyName: null,
        matched: false,
        assignmentCreated: false,
      };

      try {
        // Get fund details to find manager name
        const { data: fund, error: fundError } = await supabase
          .from('funds')
          .select('manager_name')
          .eq('id', fm.fund_id)
          .single();

        if (fundError || !fund) {
          result.error = `Fund not found: ${fundError?.message}`;
          results.push(result);
          continue;
        }

        result.fundManagerName = fund.manager_name || '';

        if (!fund.manager_name) {
          result.error = 'Fund has no manager_name';
          results.push(result);
          continue;
        }

        // Try to find matching profile using fuzzy matching
        // First try exact match, then partial match
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, company_name, manager_name')
          .or(`company_name.ilike.%${fund.manager_name}%,manager_name.ilike.%${fund.manager_name}%`);

        if (profileError) {
          result.error = `Profile search failed: ${profileError.message}`;
          results.push(result);
          continue;
        }

        // Find best match - prefer exact matches, then longest partial match
        let bestMatch = profiles?.[0];
        if (profiles && profiles.length > 0) {
          bestMatch = profiles.reduce((best, current) => {
            const currentScore = 
              (current.company_name?.toLowerCase() === fund.manager_name.toLowerCase() ? 100 : 0) +
              (current.manager_name?.toLowerCase() === fund.manager_name.toLowerCase() ? 100 : 0) +
              (current.company_name?.toLowerCase().includes(fund.manager_name.toLowerCase()) ? 50 : 0) +
              (current.manager_name?.toLowerCase().includes(fund.manager_name.toLowerCase()) ? 50 : 0);
            
            const bestScore = 
              (best.company_name?.toLowerCase() === fund.manager_name.toLowerCase() ? 100 : 0) +
              (best.manager_name?.toLowerCase() === fund.manager_name.toLowerCase() ? 100 : 0) +
              (best.company_name?.toLowerCase().includes(fund.manager_name.toLowerCase()) ? 50 : 0) +
              (best.manager_name?.toLowerCase().includes(fund.manager_name.toLowerCase()) ? 50 : 0);
            
            return currentScore > bestScore ? current : best;
          });
        }

        if (bestMatch) {
          result.profileId = bestMatch.id;
          result.profileCompanyName = bestMatch.company_name || bestMatch.manager_name || '';
          result.matched = true;

          // Check if assignment already exists
          const { data: existingAssignment } = await supabase
            .from('manager_profile_assignments')
            .select('id')
            .eq('profile_id', bestMatch.id)
            .eq('user_id', fm.user_id)
            .single();

          if (!existingAssignment) {
            // Create the assignment
            const { error: insertError } = await supabase
              .from('manager_profile_assignments')
              .insert({
                profile_id: bestMatch.id,
                user_id: fm.user_id,
                status: 'active',
                permissions: {
                  can_edit_profile: true,
                  can_edit_funds: true,
                  can_manage_team: false,
                  can_view_analytics: true,
                },
              });

            if (insertError) {
              result.error = `Failed to create assignment: ${insertError.message}`;
            } else {
              result.assignmentCreated = true;
              console.log(`✓ Created assignment: ${fm.user_id} → ${result.profileCompanyName}`);
            }
          } else {
            result.error = 'Assignment already exists';
          }
        } else {
          result.error = 'No matching profile found';
        }
      } catch (error) {
        result.error = error instanceof Error ? error.message : 'Unknown error';
      }

      results.push(result);
    }

    const summary = {
      total: results.length,
      matched: results.filter(r => r.matched).length,
      created: results.filter(r => r.assignmentCreated).length,
      errors: results.filter(r => r.error && !r.error.includes('already exists')).length,
      alreadyExisted: results.filter(r => r.error === 'Assignment already exists').length,
    };

    console.log('Backfill complete:', summary);

    return new Response(
      JSON.stringify({
        success: true,
        summary,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Backfill error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
