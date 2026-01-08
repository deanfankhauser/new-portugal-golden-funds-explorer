import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { corsHeaders } from '../_shared/cors.ts';

interface CheckInvitationsRequest {
  email: string;
  userId: string;
}

interface InvitationResult {
  companyName: string;
  profileId: string;
  inviterName: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, userId }: CheckInvitationsRequest = await req.json();

    console.log('[check-pending-invitations] Checking invitations for:', email, 'userId:', userId);

    if (!email || !userId) {
      return new Response(
        JSON.stringify({ error: 'Email and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find all pending invitations for this email
    const { data: invitations, error: invitationsError } = await supabase
      .from('team_invitations')
      .select(`
        id,
        profile_id,
        inviter_user_id,
        personal_message,
        profiles:profile_id (
          id,
          company_name,
          manager_name
        )
      `)
      .eq('email', email)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString());

    if (invitationsError) {
      console.error('[check-pending-invitations] Error fetching invitations:', invitationsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch invitations' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!invitations || invitations.length === 0) {
      console.log('[check-pending-invitations] No pending invitations found for:', email);
      return new Response(
        JSON.stringify({ acceptedInvitations: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[check-pending-invitations] Found ${invitations.length} pending invitation(s)`);

    const acceptedInvitations: InvitationResult[] = [];

    // Process each invitation
    for (const invitation of invitations) {
      try {
        const profile = invitation.profiles as any;
        const companyName = profile?.company_name || 'Unknown Company';

        console.log(`[check-pending-invitations] Processing invitation for ${companyName}`);

        // Get inviter name for logging
        const { data: inviterProfile } = await supabase
          .from('profiles')
          .select('manager_name, first_name, last_name')
          .eq('user_id', invitation.inviter_user_id)
          .single();

        const inviterName = inviterProfile?.manager_name || 
                           `${inviterProfile?.first_name || ''} ${inviterProfile?.last_name || ''}`.trim() ||
                           'Team member';

        // Assign user to company by directly inserting into manager_profile_assignments
        // Using service role key to bypass RLS
        const { error: assignError } = await supabase
          .from('manager_profile_assignments')
          .upsert({
            profile_id: invitation.profile_id,
            user_id: userId,
            assigned_by: invitation.inviter_user_id,
            status: 'active',
            permissions: {
              can_edit_profile: true,
              can_edit_funds: true,
              can_manage_team: true,
              can_view_analytics: true,
            },
            notes: invitation.personal_message || `Auto-accepted invitation from ${inviterName}`,
          }, {
            onConflict: 'profile_id,user_id'
          });

        if (assignError) {
          console.error(`[check-pending-invitations] Failed to assign user to ${companyName}:`, assignError);
          continue;
        }

        // Mark invitation as accepted
        await supabase
          .from('team_invitations')
          .update({
            status: 'accepted',
            accepted_at: new Date().toISOString(),
            used_by_user_id: userId,
          })
          .eq('id', invitation.id);

        acceptedInvitations.push({
          companyName,
          profileId: invitation.profile_id,
          inviterName,
        });

        console.log(`[check-pending-invitations] Successfully accepted invitation for ${companyName}`);
      } catch (error) {
        console.error('[check-pending-invitations] Error processing invitation:', error);
        // Continue with other invitations
      }
    }

    return new Response(
      JSON.stringify({
        acceptedInvitations,
        message: acceptedInvitations.length > 0 
          ? `Successfully accepted ${acceptedInvitations.length} invitation(s)` 
          : 'No invitations were accepted',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[check-pending-invitations] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
