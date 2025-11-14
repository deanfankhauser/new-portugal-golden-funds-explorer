import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { corsHeaders } from '../_shared/cors.ts';

interface AcceptInvitationRequest {
  invitationToken: string;
  userId: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { invitationToken, userId }: AcceptInvitationRequest = await req.json();

    console.log('[accept-team-invitation] Request received', { 
      invitationToken: invitationToken?.substring(0, 10) + '...', 
      userId 
    });

    // Validate input
    if (!invitationToken || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get invitation details
    const { data: invitation, error: invitationError } = await supabase
      .from('team_invitations')
      .select('id, email, profile_id, inviter_user_id, personal_message, status, expires_at')
      .eq('invitation_token', invitationToken)
      .single();

    if (invitationError || !invitation) {
      console.error('[accept-team-invitation] Invitation not found', invitationError);
      return new Response(
        JSON.stringify({ error: 'Invalid invitation token' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if invitation is still pending
    if (invitation.status !== 'pending') {
      return new Response(
        JSON.stringify({ error: `Invitation has been ${invitation.status}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if invitation has expired
    const expiresAt = new Date(invitation.expires_at);
    const now = new Date();
    if (expiresAt < now) {
      await supabase
        .from('team_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id);

      return new Response(
        JSON.stringify({ error: 'Invitation has expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's email to verify it matches invitation
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('user_id', userId)
      .single();

    if (!userProfile || userProfile.email !== invitation.email) {
      return new Response(
        JSON.stringify({ 
          error: 'User email does not match invitation email',
          details: 'This invitation was sent to a different email address.'
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already has access
    const { data: existingAssignment } = await supabase
      .from('manager_profile_assignments')
      .select('id, status')
      .eq('profile_id', invitation.profile_id)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingAssignment && existingAssignment.status === 'active') {
      // Mark invitation as accepted even though user already has access
      await supabase
        .from('team_invitations')
        .update({ 
          status: 'accepted',
          accepted_at: now.toISOString(),
          used_by_user_id: userId
        })
        .eq('id', invitation.id);

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'You already have access to this company',
          alreadyAssigned: true
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Assign user to company
    const { error: assignError } = await supabase.rpc(
      'assign_company_team_member',
      {
        _profile_id: invitation.profile_id,
        _manager_id: userId,
        _permissions: {
          can_edit_profile: true,
          can_edit_funds: true,
          can_manage_team: true,
          can_view_analytics: true,
        },
        _status: 'active',
        _notes: invitation.personal_message || 'Accepted team invitation',
      }
    );

    if (assignError) {
      console.error('[accept-team-invitation] Assignment failed', assignError);
      return new Response(
        JSON.stringify({ error: 'Failed to assign user to company' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark invitation as accepted
    const { error: updateError } = await supabase
      .from('team_invitations')
      .update({ 
        status: 'accepted',
        accepted_at: now.toISOString(),
        used_by_user_id: userId
      })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('[accept-team-invitation] Failed to update invitation status', updateError);
      // Don't fail the request, user is already assigned
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully joined the team',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[accept-team-invitation] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
