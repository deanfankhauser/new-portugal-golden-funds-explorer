import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import {
  generateEmailWrapper,
  generateCTAButton,
  generateContentCard,
  generatePlainTextEmail,
  COMPANY_INFO,
} from "../_shared/email-templates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AssignmentRequest {
  profile_id: string;
  company_name: string;
  manager_name: string;
  manager_email: string;
  permissions: {
    can_edit_profile?: boolean;
    can_edit_funds?: boolean;
    can_manage_team?: boolean;
    can_view_analytics?: boolean;
  };
  notes?: string;
  assigned_at: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      profile_id,
      company_name,
      manager_name,
      manager_email,
      permissions,
      notes,
      assigned_at,
    }: AssignmentRequest = await req.json();

    console.log(`Sending profile assignment notification to:`, manager_email);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const postmarkToken = Deno.env.get("POSTMARK_SERVER_TOKEN");
    const notificationEmail = Deno.env.get("NOTIFICATION_FROM_EMAIL") || "noreply@movingto.com";

    if (!postmarkToken) {
      throw new Error("POSTMARK_SERVER_TOKEN not configured");
    }

    // Create Supabase client to fetch associated funds
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all funds associated with this company using smart matching
    const { data: associatedFunds, error: fundsError } = await supabase
      .rpc('get_funds_by_company_name', { company_name_param: company_name });

    if (fundsError) {
      console.error('Error fetching associated funds:', fundsError);
      console.error('Company name:', company_name);
    }

    console.log(`Found ${associatedFunds?.length || 0} funds for company: ${company_name}`);

    const fundCount = associatedFunds?.length || 0;
    
    const subject = `🎯 You've Been Assigned to Manage ${company_name} and ${fundCount} Fund${fundCount !== 1 ? 's' : ''}`;

    // Format permissions list
    const permissionsList = [];
    if (permissions.can_edit_profile) permissionsList.push('✓ Edit company profile');
    if (permissions.can_edit_funds) permissionsList.push('✓ Edit associated funds');
    if (permissions.can_manage_team) permissionsList.push('✓ Manage team members');
    if (permissions.can_view_analytics) permissionsList.push('✓ View analytics');

    // Build funds list HTML
    const fundsListHtml = associatedFunds && associatedFunds.length > 0 ? `
      <div style="margin: 32px 0; padding: 20px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E5E7EB;">
        <h3 style="color: #4B0F23; margin: 0 0 16px 0; font-size: 18px;">Associated Funds (${fundCount})</h3>
        <ul style="margin: 0; padding-left: 20px; line-height: 2;">
          ${associatedFunds.map(fund => `<li style="color: #64748b;">${fund.name}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    const bodyContent = `
      ${generateContentCard(`
        <h2 style="color: #4B0F23; margin: 0 0 16px 0; font-size: 24px;">Company Manager Assignment</h2>
        <p style="margin: 0 0 16px 0; line-height: 1.6;">
          Hello ${manager_name},
        </p>
        <p style="margin: 0 0 16px 0; line-height: 1.6;">
          You have been assigned to manage <strong>${company_name}</strong> and all associated funds on Movingto Funds.
        </p>
        <p style="margin: 0 0 0 0; line-height: 1.6;">
          This gives you access to manage <strong>${fundCount} fund${fundCount !== 1 ? 's' : ''}</strong> under this company.
        </p>
      `, 'bordeaux')}

      ${fundsListHtml}
      
      <div style="margin: 32px 0;">
        <h3 style="color: #4B0F23; margin: 0 0 16px 0; font-size: 18px;">Your Permissions</h3>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          ${permissionsList.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>

      ${notes ? `
      <div style="background: #FEF9F5; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #A97155;">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #4B0F23;">Assignment Notes:</p>
        <p style="margin: 0; color: #64748b;">${notes}</p>
      </div>
      ` : ''}

      <div style="margin: 32px 0; padding: 20px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E5E7EB;">
        <p style="margin: 0 0 12px 0; font-weight: 600; color: #4B0F23;">To access your funds:</p>
        <ol style="margin: 0; padding-left: 20px; color: #64748b; line-height: 1.8;">
          <li>Sign in to your account</li>
          <li>Click on your account icon in the top right</li>
          <li>Click "Manage funds"</li>
        </ol>
      </div>

      <div style="margin: 32px 0; padding: 16px; background: #F8FAFC; border-radius: 8px;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">
          <strong>💡 Tip:</strong> Keep your company profile and fund information up-to-date to attract more investors and improve your visibility on the platform.
        </p>
      </div>

      <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
        If you have any questions or need assistance, please don't hesitate to reach out.
      </p>
    `;

    const htmlContent = generateEmailWrapper(subject, bodyContent, manager_email);
    
    const fundsListText = associatedFunds && associatedFunds.length > 0 
      ? `\n\nAssociated Funds (${fundCount}):\n${associatedFunds.map(f => `- ${f.name}`).join('\n')}\n`
      : '';
    
    const plainTextContent = generatePlainTextEmail(
      subject,
      `Hello ${manager_name},\n\nYou have been assigned to manage ${company_name} and all associated funds on Movingto Funds.\n\nThis gives you access to manage ${fundCount} fund${fundCount !== 1 ? 's' : ''} under this company.${fundsListText}\n\nYour permissions:\n${permissionsList.map(p => `- ${p}`).join('\n')}\n\n${notes ? `Notes: ${notes}\n\n` : ''}To access your funds:\n1. Sign in to your account\n2. Click on your account icon in the top right\n3. Click "Manage funds"\n\nBest regards,\nThe Movingto Funds Team`,
      undefined,
      undefined
    );

    // Send via Postmark
    const postmarkResponse = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify({
        From: `Movingto Funds <${notificationEmail}>`,
        To: manager_email,
        Subject: subject,
        HtmlBody: htmlContent,
        TextBody: plainTextContent,
        MessageStream: "outbound",
      }),
    });

    if (!postmarkResponse.ok) {
      const errorText = await postmarkResponse.text();
      console.error("Postmark error:", errorText);
      throw new Error(`Postmark API error: ${postmarkResponse.status}`);
    }

    const result = await postmarkResponse.json();
    console.log("Profile assignment email sent successfully:", result);

    // Log email to tracking table
    try {
      await supabase.from('fund_manager_email_logs').insert({
        postmark_message_id: result.MessageId,
        email_type: 'profile_assignment',
        fund_id: null,
        manager_email: manager_email,
        manager_name: manager_name,
        subject: subject,
        is_verified_fund: false,
        sent_at: new Date().toISOString(),
        test_mode: false,
      });
    } catch (logError) {
      console.error("Failed to log email:", logError);
    }

    // Get the newly assigned user's ID to exclude from team notifications
    const { data: assignedUserId, error: userIdError } = await supabase
      .rpc('find_user_by_email', { user_email: manager_email });

    if (userIdError) {
      console.error('Error finding user by email:', userIdError);
    }

    // Notify all other active team members about the new member
    const { data: otherTeamMembers, error: teamError } = await supabase
      .from('manager_profile_assignments')
      .select(`
        user_id,
        profiles!inner(email, manager_name, first_name, last_name)
      `)
      .eq('profile_id', profile_id)
      .eq('status', 'active')
      .neq('user_id', assignedUserId);

    if (teamError) {
      console.error('Error fetching other team members:', teamError);
    }

    if (otherTeamMembers && otherTeamMembers.length > 0) {
      console.log(`Notifying ${otherTeamMembers.length} existing team members about new member`);

      const teamNotificationSubject = `👥 New Team Member Joined: ${manager_name} added to ${company_name}`;

      // Send emails to all other team members
      for (const member of otherTeamMembers) {
        const memberEmail = member.profiles?.email;
        const memberName = member.profiles?.manager_name || 
                          `${member.profiles?.first_name || ''} ${member.profiles?.last_name || ''}`.trim() ||
                          memberEmail?.split('@')[0];

        if (!memberEmail) continue;

        const teamBodyContent = `
          ${generateContentCard(`
            <h2 style="color: #4B0F23; margin: 0 0 16px 0; font-size: 24px;">New Team Member Joined</h2>
            <p style="margin: 0 0 16px 0; line-height: 1.6;">
              Hello ${memberName},
            </p>
            <p style="margin: 0 0 16px 0; line-height: 1.6;">
              <strong>${manager_name}</strong> has been added to your team for <strong>${company_name}</strong>.
            </p>
            <p style="margin: 0 0 0 0; line-height: 1.6;">
              They now have access to manage <strong>${fundCount} fund${fundCount !== 1 ? 's' : ''}</strong> under this company.
            </p>
          `, 'bordeaux')}

          ${fundsListHtml}

          <div style="margin: 32px 0;">
            <h3 style="color: #4B0F23; margin: 0 0 16px 0; font-size: 18px;">Their Permissions</h3>
            <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
              ${permissionsList.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>

          <div style="margin: 32px 0; padding: 20px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E5E7EB;">
            <p style="margin: 0 0 12px 0; font-weight: 600; color: #4B0F23;">To view your team:</p>
            <ol style="margin: 0; padding-left: 20px; color: #64748b; line-height: 1.8;">
              <li>Sign in to your account</li>
              <li>Click on your account icon in the top right</li>
              <li>Click "Manage funds"</li>
            </ol>
          </div>

          <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
            This is an automated notification to keep you informed about team changes.
          </p>
        `;

        const teamHtmlContent = generateEmailWrapper(teamNotificationSubject, teamBodyContent, memberEmail);
        const teamPlainTextContent = generatePlainTextEmail(
          teamNotificationSubject,
          `Hello ${memberName},\n\n${manager_name} has been added to your team for ${company_name}.\n\nThey now have access to manage ${fundCount} fund${fundCount !== 1 ? 's' : ''} under this company.${fundsListHtml ? '\n\nAssociated Funds:\n' + associatedFunds.map(f => `- ${f.name}`).join('\n') : ''}\n\nTheir permissions:\n${permissionsList.map(p => `- ${p}`).join('\n')}\n\nTo view your team:\n1. Sign in to your account\n2. Click on your account icon in the top right\n3. Click "Manage funds"\n\nBest regards,\nThe Movingto Funds Team`,
          undefined,
          undefined
        );

        try {
          const teamResponse = await fetch("https://api.postmarkapp.com/email", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "X-Postmark-Server-Token": postmarkToken,
            },
            body: JSON.stringify({
              From: `Movingto Funds <${notificationEmail}>`,
              To: memberEmail,
              Subject: teamNotificationSubject,
              HtmlBody: teamHtmlContent,
              TextBody: teamPlainTextContent,
              MessageStream: "outbound",
            }),
          });
          
          const teamResult = await teamResponse.json();
          console.log(`Team notification sent to: ${memberEmail}`);
          
          // Log team notification email
          try {
            await supabase.from('fund_manager_email_logs').insert({
              postmark_message_id: teamResult.MessageId,
              email_type: 'team_notification',
              fund_id: null,
              manager_email: memberEmail,
              manager_name: memberName,
              subject: teamNotificationSubject,
              is_verified_fund: false,
              sent_at: new Date().toISOString(),
              test_mode: false,
            });
          } catch (logError) {
            console.error(`Failed to log team notification for ${memberEmail}:`, logError);
          }
        } catch (emailError) {
          console.error(`Failed to send team notification to ${memberEmail}:`, emailError);
          // Continue with other emails even if one fails
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, messageId: result.MessageId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in notify-manager-profile-assignment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});