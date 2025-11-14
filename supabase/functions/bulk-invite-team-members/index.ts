import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { corsHeaders } from '../_shared/cors.ts';
import { ServerClient } from 'npm:postmark@4.0.0';
import { generateEmailWrapper, generateContentCard, generateCTAButton, COMPANY_INFO } from '../_shared/email-templates.ts';

const postmark = new ServerClient(Deno.env.get('POSTMARK_SERVER_TOKEN')!);

interface BulkInviteRequest {
  companyName: string;
  emails: string[];
  inviterUserId: string;
  personalMessage?: string;
}

interface InviteResult {
  email: string;
  success: boolean;
  error?: string;
  userExists?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { companyName, emails, inviterUserId, personalMessage }: BulkInviteRequest = await req.json();

    console.log(`[bulk-invite] Processing ${emails.length} invitations for company: ${companyName}`);

    // Validation
    if (!companyName || !emails || !Array.isArray(emails) || emails.length === 0 || !inviterUserId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields or invalid emails array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limit bulk invites
    if (emails.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Maximum 50 emails allowed per bulk invite' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      return new Response(
        JSON.stringify({ error: `Invalid email format: ${invalidEmails.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify inviter has permission
    const { data: canManage } = await supabase.rpc('can_user_manage_company_funds', {
      check_user_id: inviterUserId,
      check_manager_name: companyName,
    });

    if (!canManage) {
      return new Response(
        JSON.stringify({ error: 'You do not have permission to manage this company' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get company profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, company_name, manager_name')
      .eq('company_name', companyName)
      .single();

    if (profileError || !profile) {
      console.error('[bulk-invite] Profile lookup error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Company profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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

    // Process each email
    const results: InviteResult[] = [];
    
    for (const inviteeEmail of emails) {
      try {
        // Find user by email
        const { data: userId } = await supabase.rpc('find_user_by_email', {
          user_email: inviteeEmail,
        });

        let assignedUserId = userId;
        let userExists = !!userId;

        // Check for existing assignment
        if (userId) {
          const { data: existingAssignment } = await supabase
            .from('manager_profile_assignments')
            .select('id, status')
            .eq('profile_id', profile.id)
            .eq('user_id', userId)
            .maybeSingle();

          if (existingAssignment?.status === 'active') {
            results.push({
              email: inviteeEmail,
              success: false,
              error: 'User already has access',
            });
            continue;
          }
        }

        // If user doesn't exist, create invitation and send signup email
        if (!userId) {
          // Create invitation token
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
            console.error(`[bulk-invite] Invitation creation error for ${inviteeEmail}:`, invitationError);
            results.push({
              email: inviteeEmail,
              success: false,
              error: 'Failed to create invitation',
            });
            continue;
          }

          const invitationUrl = `https://funds.movingto.com/invite/${invitation.invitation_token}`;

          // Send invitation email
          const newUserEmailContent = `
            <p style="font-size: 16px; line-height: 24px; color: #374151; margin-bottom: 24px;">
              ${inviterName} has invited you to join the <strong>${companyName}</strong> team on <strong>Movingto Funds</strong>.
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
            ${generateCTAButton('Accept Invitation & Create Account', invitationUrl, 'bordeaux')}
            <p style="font-size: 14px; line-height: 20px; color: #9CA3AF; margin-top: 32px; text-align: center;">
              This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
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
              Subject: `You've been invited to join ${companyName} on Movingto Funds`,
              HtmlBody: newUserHtml,
              TextBody: `You've been invited to join ${companyName} on Movingto Funds\n\n${inviterName} has invited you to join the team.\n\nClick here to accept: ${invitationUrl}\n\nThis invitation expires in 7 days.`,
              MessageStream: 'outbound',
            });

            results.push({
              email: inviteeEmail,
              success: true,
              userExists: false,
            });

            console.log(`[bulk-invite] Invitation sent to new user: ${inviteeEmail}`);
          } catch (emailError: any) {
            console.error(`[bulk-invite] Email send error for ${inviteeEmail}:`, emailError);
            
            // Clean up invitation if email fails
            await supabase
              .from('team_invitations')
              .delete()
              .eq('invitation_token', invitation.invitation_token);
            
            results.push({
              email: inviteeEmail,
              success: false,
              error: 'Failed to send invitation email',
            });
          }
        } else {
          // User exists - assign immediately and send notification
          const { error: assignError } = await supabase.rpc('assign_company_team_member', {
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
          });

          if (assignError) {
            console.error(`[bulk-invite] Assignment error for ${inviteeEmail}:`, assignError);
            results.push({
              email: inviteeEmail,
              success: false,
              error: assignError.message,
            });
            continue;
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
            console.error(`[bulk-invite] Failed to send notification email for ${inviteeEmail}:`, emailError);
            // Don't fail the request if email fails, user is already assigned
          }

          results.push({
            email: inviteeEmail,
            success: true,
            userExists: true,
          });

          console.log(`[bulk-invite] Existing user assigned: ${inviteeEmail}`);
        }

      } catch (error: any) {
        console.error(`[bulk-invite] Error processing ${inviteeEmail}:`, error);
        results.push({
          email: inviteeEmail,
          success: false,
          error: error.message || 'Unknown error',
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`[bulk-invite] Complete: ${successful} succeeded, ${failed} failed out of ${emails.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        total: emails.length,
        successful,
        failed,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[bulk-invite] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
