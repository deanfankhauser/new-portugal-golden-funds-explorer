import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { corsHeaders } from '../_shared/cors.ts';
import { ServerClient } from 'npm:postmark@4.0.0';
import { generateEmailWrapper, generateContentCard, generateCTAButton, COMPANY_INFO } from '../_shared/email-templates.ts';

interface InviteRequest {
  companyName: string;
  inviteeEmail: string;
  personalMessage?: string;
}

const postmark = new ServerClient(Deno.env.get('POSTMARK_SERVER_TOKEN')!);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract user from JWT - verify_jwt=true ensures this is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[invite-team-member] No authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - no authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a client with the user's JWT to verify their identity
    const supabaseClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('[invite-team-member] Failed to get user from JWT', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use the authenticated user's ID instead of trusting client-provided value
    const inviterUserId = user.id;

    const { companyName, inviteeEmail, personalMessage }: InviteRequest = await req.json();

    console.log('[invite-team-member] Request received', { companyName, inviteeEmail, inviterUserId });

    // Validate input
    if (!companyName || !inviteeEmail) {
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
        JSON.stringify({ error: 'Unauthorized - you do not have access to manage this company' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find user by email
    const { data: userId, error: userLookupError } = await supabase.rpc('find_user_by_email', {
      user_email: inviteeEmail,
    });

    const userExists = !!userId;
    console.log('[invite-team-member] User lookup', { userId, userExists });

    // Check if invitee already has access
    if (userId) {
      const { data: existingAssignment } = await supabase
        .from('manager_profile_assignments')
        .select('id, status')
        .eq('profile_id', profile.id)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingAssignment && existingAssignment.status === 'active') {
        return new Response(
          JSON.stringify({ error: 'User already has access to this company', userExists: true }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get inviter details
    const { data: inviterProfile } = await supabase
      .from('profiles')
      .select('manager_name, first_name, last_name, email')
      .eq('user_id', inviterUserId)
      .single();

    const inviterName = inviterProfile?.manager_name || 
                       `${inviterProfile?.first_name || ''} ${inviterProfile?.last_name || ''}`.trim() ||
                       inviterProfile?.email?.split('@')[0] || 
                       'A team member';

    if (userExists && userId) {
      // User exists - assign immediately and send notification
      const { error: assignError } = await supabase.rpc(
        'assign_company_team_member',
        {
          _profile_id: profile.id,
          _manager_id: userId,
          _permissions: {
            can_edit_profile: true,
            can_edit_funds: true,
            can_manage_team: true,
            can_view_analytics: true,
          },
          _status: 'active',
          _notes: personalMessage || `Invited by ${inviterName}`,
        }
      );

      if (assignError) {
        console.error('[invite-team-member] Assignment failed', assignError);
        return new Response(
          JSON.stringify({ error: 'Failed to assign user to company' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Send notification email to existing user
      const existingUserEmailContent = `
        <p style="font-size: 16px; line-height: 24px; color: #374151; margin-bottom: 24px;">
          Great news! ${inviterName} has added you to the <strong>${companyName}</strong> team on Movingto Funds.
        </p>
        ${personalMessage ? generateContentCard(`
          <p style="font-size: 14px; line-height: 20px; color: #6B7280; margin: 0;">
            <strong>Personal message from ${inviterName}:</strong><br/>
            "${personalMessage}"
          </p>
        `) : ''}
        <p style="font-size: 16px; line-height: 24px; color: #374151; margin-bottom: 24px;">
          You now have full access to manage ${companyName}'s fund profiles, view analytics, and manage leads.
        </p>
        ${generateCTAButton('View Dashboard', 'https://funds.movingto.com/my-funds', 'bordeaux')}
        <p style="font-size: 14px; line-height: 20px; color: #6B7280; margin-top: 32px;">
          If you have any questions, please don't hesitate to reach out to your team.
        </p>
      `;

      const existingUserHtml = generateEmailWrapper(
        `You've been added to ${companyName}`,
        existingUserEmailContent,
        inviteeEmail
      );

      try {
        await postmark.sendEmail({
          From: COMPANY_INFO.email,
          To: inviteeEmail,
          Subject: `You've been added to ${companyName} team`,
          HtmlBody: existingUserHtml,
          TextBody: `You've been added to ${companyName} team\n\n${inviterName} has added you to the team.\n\nYou now have full access to manage the company's fund profiles.\n\nVisit: https://funds.movingto.com/my-funds`,
          MessageStream: 'outbound',
        });
      } catch (emailError: any) {
        console.error('[invite-team-member] Failed to send notification email', emailError);
        // Don't fail the request if email fails, user is already assigned
      }

      return new Response(
        JSON.stringify({
          success: true,
          userExists: true,
          message: 'Team member added successfully and notified via email',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // User doesn't exist - create invitation token and send signup email
      const { data: invitation, error: invitationError } = await supabase
        .from('team_invitations')
        .insert({
          email: inviteeEmail,
          profile_id: profile.id,
          inviter_user_id: inviterUserId,
          personal_message: personalMessage,
        })
        .select('invitation_token')
        .single();

      if (invitationError || !invitation) {
        console.error('[invite-team-member] Failed to create invitation', invitationError);
        return new Response(
          JSON.stringify({ error: 'Failed to create invitation' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Send invitation email to new user
      const newUserEmailContent = `
        <p style="font-size: 16px; line-height: 24px; color: #374151; margin-bottom: 24px;">
          Great news! ${inviterName} has added you to the <strong>${companyName}</strong> team on <strong>Movingto Funds</strong>.
        </p>
        ${personalMessage ? generateContentCard(`
          <p style="font-size: 14px; line-height: 20px; color: #6B7280; margin: 0;">
            <strong>Personal message from ${inviterName}:</strong><br/>
            "${personalMessage}"
          </p>
        `) : ''}
        <p style="font-size: 16px; line-height: 24px; color: #374151; margin-bottom: 16px;">
          <strong>What is Movingto Funds?</strong><br/>
          Movingto Funds is Portugal's leading platform for Portuguese investment funds, helping investors discover the best opportunities while enabling fund managers to showcase their funds and connect with qualified investors.
        </p>
        <p style="font-size: 16px; line-height: 24px; color: #374151; margin-bottom: 24px;">
          As a team member, you'll be able to:
        </p>
        <ul style="font-size: 16px; line-height: 24px; color: #374151; margin-bottom: 24px; padding-left: 24px;">
          <li>Update and manage ${companyName}'s fund profiles</li>
          <li>View detailed analytics and engagement metrics</li>
          <li>Receive and manage investor leads</li>
          <li>Collaborate with your team members</li>
        </ul>
        ${generateContentCard(`
          <p style="font-size: 16px; line-height: 22px; color: #374151; margin: 0; text-align: center;">
            <strong>To get started:</strong><br/>
            Sign in or create an account at <a href="https://funds.movingto.com/auth" style="color: #9333EA;">funds.movingto.com</a> using <strong>${inviteeEmail}</strong>
          </p>
        `)}
        <p style="font-size: 14px; line-height: 20px; color: #9CA3AF; margin-top: 24px; text-align: center;">
          Your email has been pre-authorized for the ${companyName} team. Once you sign in, you'll automatically have full access.
        </p>
        <p style="font-size: 14px; line-height: 20px; color: #9CA3AF; margin-top: 16px; text-align: center;">
          If you didn't expect this invitation, you can safely ignore this email.
        </p>
      `;

      const newUserHtml = generateEmailWrapper(
        `You've been invited to join ${companyName}`,
        newUserEmailContent,
        inviteeEmail
      );

      try {
        await postmark.sendEmail({
          From: COMPANY_INFO.email,
          To: inviteeEmail,
        Subject: `You've been added to ${companyName} team on Movingto Funds`,
        HtmlBody: newUserHtml,
        TextBody: `You've been added to ${companyName} team on Movingto Funds\n\n${inviterName} has added you to the team.\n\nTo get started, sign in or create an account at funds.movingto.com/auth using ${inviteeEmail}.\n\nYour email has been pre-authorized and you'll automatically have full access once you sign in.`,
          MessageStream: 'outbound',
        });
      } catch (emailError: any) {
        console.error('[invite-team-member] Failed to send invitation email', emailError);
        
        // Clean up invitation if email fails
        await supabase
          .from('team_invitations')
          .delete()
          .eq('invitation_token', invitation.invitation_token);
        
        return new Response(
          JSON.stringify({ 
            error: 'Failed to send invitation email',
            details: emailError instanceof Error ? emailError.message : 'Unknown error'
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          userExists: false,
          message: 'Invitation sent via email',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('[invite-team-member] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
