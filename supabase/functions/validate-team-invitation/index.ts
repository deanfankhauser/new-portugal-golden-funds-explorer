import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { corsHeaders } from '../_shared/cors.ts';

interface ValidateInvitationRequest {
  invitationToken: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { invitationToken }: ValidateInvitationRequest = await req.json();

    console.log('[validate-team-invitation] Request received', { invitationToken: invitationToken?.substring(0, 10) + '...' });

    // Validate input
    if (!invitationToken) {
      return new Response(
        JSON.stringify({ error: 'Missing invitation token' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark expired invitations first
    await supabase.rpc('mark_expired_invitations');

    // Get invitation details
    const { data: invitation, error: invitationError } = await supabase
      .from('team_invitations')
      .select(`
        id,
        email,
        profile_id,
        inviter_user_id,
        personal_message,
        status,
        expires_at,
        created_at,
        profiles!team_invitations_profile_id_fkey (
          company_name,
          manager_name
        )
      `)
      .eq('invitation_token', invitationToken)
      .single();

    if (invitationError || !invitation) {
      console.error('[validate-team-invitation] Invitation not found', invitationError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid invitation token',
          valid: false 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if invitation is still pending
    if (invitation.status !== 'pending') {
      return new Response(
        JSON.stringify({ 
          error: `Invitation has been ${invitation.status}`,
          valid: false,
          status: invitation.status
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if invitation has expired
    const expiresAt = new Date(invitation.expires_at);
    const now = new Date();
    if (expiresAt < now) {
      // Update status to expired
      await supabase
        .from('team_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id);

      return new Response(
        JSON.stringify({ 
          error: 'Invitation has expired',
          valid: false,
          status: 'expired'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get inviter details
    const { data: inviterProfile } = await supabase
      .from('profiles')
      .select('manager_name, first_name, last_name, email')
      .eq('user_id', invitation.inviter_user_id)
      .single();

    const inviterName = inviterProfile?.manager_name || 
                       `${inviterProfile?.first_name || ''} ${inviterProfile?.last_name || ''}`.trim() ||
                       inviterProfile?.email?.split('@')[0] || 
                       'A team member';

    // Return invitation details
    return new Response(
      JSON.stringify({
        valid: true,
        invitation: {
          email: invitation.email,
          companyName: invitation.profiles?.company_name,
          inviterName,
          personalMessage: invitation.personal_message,
          expiresAt: invitation.expires_at,
          createdAt: invitation.created_at,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[validate-team-invitation] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
