import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { corsHeaders } from '../_shared/cors.ts';

interface RemoveRequest {
  profileId: string;
  userIdToRemove: string;
  requesterUserId: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { profileId, userIdToRemove, requesterUserId }: RemoveRequest = await req.json();

    console.log('[remove-team-member] Request received', { profileId, userIdToRemove, requesterUserId });

    // Validate input
    if (!profileId || !userIdToRemove || !requesterUserId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the company profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, company_name')
      .eq('id', profileId)
      .single();

    if (profileError || !profile) {
      console.error('[remove-team-member] Company profile not found', profileError);
      return new Response(
        JSON.stringify({ error: 'Company profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify requester has access to manage this company
    const { data: requesterAccess } = await supabase.rpc('can_user_manage_company_funds', {
      check_user_id: requesterUserId,
      check_manager_name: profile.company_name,
    });

    if (!requesterAccess) {
      console.error('[remove-team-member] Requester does not have access');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prevent removing self if they're the last member
    const { data: activeMembers, error: countError } = await supabase
      .from('manager_profile_assignments')
      .select('id, user_id')
      .eq('profile_id', profileId)
      .eq('status', 'active');

    if (countError) {
      console.error('[remove-team-member] Failed to count members', countError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify team members' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (activeMembers.length === 1 && activeMembers[0].user_id === userIdToRemove) {
      return new Response(
        JSON.stringify({ error: 'Cannot remove the last team member' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update assignment status to 'revoked'
    const { error: updateError } = await supabase
      .from('manager_profile_assignments')
      .update({ status: 'revoked', updated_at: new Date().toISOString() })
      .eq('profile_id', profileId)
      .eq('user_id', userIdToRemove);

    if (updateError) {
      console.error('[remove-team-member] Failed to remove member', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to remove team member' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the action
    await supabase.rpc('log_admin_activity', {
      p_action_type: 'TEAM_MEMBER_REMOVED',
      p_target_type: 'manager_profile',
      p_target_id: profileId,
      p_details: {
        removed_user_id: userIdToRemove,
        company_name: profile.company_name,
      },
    });

    console.log('[remove-team-member] Member removed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Team member removed successfully',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[remove-team-member] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
