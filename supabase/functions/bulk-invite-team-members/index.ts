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

        // If user doesn't exist, send signup invitation
        if (!userId) {
          const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
            inviteeEmail,
            {
              data: {
                invited_to_company: companyName,
                personal_message: personalMessage,
              },
              redirectTo: `${supabaseUrl.replace('.supabase.co', '.lovableproject.com')}/my-funds`,
            }
          );

          if (inviteError) {
            console.error(`[bulk-invite] Invite error for ${inviteeEmail}:`, inviteError);
            results.push({
              email: inviteeEmail,
              success: false,
              error: inviteError.message,
            });
            continue;
          }

          assignedUserId = inviteData.user.id;
        }

        // Assign user to profile
        const { error: assignError } = await supabase.rpc('assign_company_team_member', {
          _profile_id: profile.id,
          _manager_id: assignedUserId,
          _permissions: {
            can_edit_profile: true,
            can_edit_funds: true,
            can_manage_team: true,
            can_view_analytics: true,
          },
          _status: 'active',
          _notes: personalMessage,
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

        results.push({
          email: inviteeEmail,
          success: true,
          userExists,
        });

        console.log(`[bulk-invite] Successfully invited: ${inviteeEmail}`);
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
