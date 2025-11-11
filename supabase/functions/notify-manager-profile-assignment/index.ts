import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const postmarkToken = Deno.env.get("POSTMARK_SERVER_TOKEN");
    const notificationEmail = Deno.env.get("NOTIFICATION_FROM_EMAIL") || "noreply@movingto.com";

    if (!postmarkToken) {
      throw new Error("POSTMARK_SERVER_TOKEN not configured");
    }

    const manageProfileUrl = `${supabaseUrl.replace('.supabase.co', '.lovableproject.com')}/manage-profile/${profile_id}`;
    
    const subject = `🎯 You've Been Assigned to Manage ${company_name}`;

    // Format permissions list
    const permissionsList = [];
    if (permissions.can_edit_profile) permissionsList.push('✓ Edit company profile');
    if (permissions.can_edit_funds) permissionsList.push('✓ Edit associated funds');
    if (permissions.can_manage_team) permissionsList.push('✓ Manage team members');
    if (permissions.can_view_analytics) permissionsList.push('✓ View analytics');

    const bodyContent = `
      ${generateContentCard(`
        <h2 style="color: #4B0F23; margin: 0 0 16px 0; font-size: 24px;">Manager Profile Assignment</h2>
        <p style="margin: 0 0 16px 0; line-height: 1.6;">
          Hello ${manager_name},
        </p>
        <p style="margin: 0 0 16px 0; line-height: 1.6;">
          You have been assigned to manage the profile for <strong>${company_name}</strong> on Movingto Funds.
        </p>
      `, 'bordeaux')}
      
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

      ${generateCTAButton('Manage Profile', manageProfileUrl, 'bordeaux')}

      <div style="margin: 32px 0; padding: 16px; background: #F8FAFC; border-radius: 8px;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">
          <strong>💡 Tip:</strong> Keep your company profile up-to-date to attract more investors and improve your visibility on the platform.
        </p>
      </div>

      <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
        If you have any questions or need assistance, please don't hesitate to reach out.
      </p>
    `;

    const htmlContent = generateEmailWrapper(subject, bodyContent, manager_email);
    const plainTextContent = generatePlainTextEmail(
      subject,
      `Hello ${manager_name},\n\nYou have been assigned to manage the profile for ${company_name} on Movingto Funds.\n\nYour permissions:\n${permissionsList.map(p => `- ${p}`).join('\n')}\n\n${notes ? `Notes: ${notes}\n\n` : ''}Best regards,\nThe Movingto Funds Team`,
      'Manage Profile',
      manageProfileUrl
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
        From: `${COMPANY_INFO.TRADING_NAME} <${notificationEmail}>`,
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