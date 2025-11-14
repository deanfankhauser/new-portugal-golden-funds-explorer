import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { corsHeaders } from '../_shared/cors.ts';

interface InviteRequest {
  companyName: string;
  inviteeEmail: string;
  inviterUserId: string;
  personalMessage?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { companyName, inviteeEmail, inviterUserId, personalMessage }: InviteRequest = await req.json();

    console.log('[invite-team-member] Request received', { companyName, inviteeEmail, inviterUserId });

    // Validate input
    if (!companyName || !inviteeEmail || !inviterUserId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteeEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the company profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, company_name, manager_name')
      .eq('company_name', companyName)
      .single();

    if (profileError || !profile) {
      console.error('[invite-team-member] Company profile not found', profileError);
      return new Response(
        JSON.stringify({ error: 'Company profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify inviter has access to this company
    const { data: inviterAccess } = await supabase.rpc('can_user_manage_company_funds', {
      check_user_id: inviterUserId,
      check_manager_name: companyName,
    });

    if (!inviterAccess) {
      console.error('[invite-team-member] Inviter does not have access');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if invitee already has access
    const { data: existingAssignment } = await supabase
      .from('manager_profile_assignments')
      .select('id, status, user_id')
      .eq('profile_id', profile.id)
      .eq('user_id', inviterUserId)
      .maybeSingle();

    if (existingAssignment && existingAssignment.status === 'active') {
      return new Response(
        JSON.stringify({ error: 'User already has access to this company', userExists: true }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find user by email using the admin function
    const { data: userId, error: userLookupError } = await supabase.rpc('find_user_by_email', {
      user_email: inviteeEmail,
    });

    let userExists = !!userId;
    let assignedUserId = userId;

    console.log('[invite-team-member] User lookup', { userId, userExists });

    // If user doesn't exist, send signup invitation
    if (!userId) {
      // Create auth invitation
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        inviteeEmail,
        {
          redirectTo: `${supabaseUrl.replace('https://', 'https://bkmvydnfhmkjnuszroim')}/auth/callback`,
        }
      );

      if (inviteError) {
        console.error('[invite-team-member] Failed to invite user', inviteError);
        return new Response(
          JSON.stringify({ error: 'Failed to send invitation email' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      assignedUserId = inviteData.user?.id;
      console.log('[invite-team-member] Invitation sent to new user', { inviteData });
    }

    // Assign user to company profile using admin function
    if (assignedUserId) {
      const { data: assignmentResult, error: assignError } = await supabase.rpc(
        'admin_assign_profile_managers',
        {
          _profile_id: profile.id,
          _manager_ids: [assignedUserId],
          _permissions: {
            can_edit_profile: true,
            can_edit_funds: true,
            can_manage_team: true,
            can_view_analytics: true,
          },
          _status: 'active',
          _notes: personalMessage || `Invited by team member`,
        }
      );

      if (assignError) {
        console.error('[invite-team-member] Assignment failed', assignError);
        return new Response(
          JSON.stringify({ error: 'Failed to assign user to company' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('[invite-team-member] Assignment successful', assignmentResult);
    }

    // The trigger will automatically send the notification email via notify-manager-profile-assignment

    return new Response(
      JSON.stringify({
        success: true,
        userExists,
        message: userExists 
          ? 'Team member added successfully and notified via email'
          : 'Invitation sent to email address',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[invite-team-member] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
