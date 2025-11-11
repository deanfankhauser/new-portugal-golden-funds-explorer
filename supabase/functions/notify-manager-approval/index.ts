import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
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

interface ApprovalRequest {
  profile_id: string;
  company_name: string;
  manager_name: string;
  email: string;
  approved: boolean;
  rejection_reason?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profile_id, company_name, manager_name, email, approved, rejection_reason }: ApprovalRequest = await req.json();

    console.log(`Sending ${approved ? 'approval' : 'rejection'} email to:`, email);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const postmarkToken = Deno.env.get("POSTMARK_SERVER_TOKEN");
    const notificationEmail = Deno.env.get("NOTIFICATION_FROM_EMAIL") || "noreply@movingto.com";

    if (!postmarkToken) {
      throw new Error("POSTMARK_SERVER_TOKEN not configured");
    }

    let htmlContent: string;
    let plainTextContent: string;
    let subject: string;

    if (approved) {
      // Approval email
      subject = `🎉 Welcome to Movingto Funds, ${company_name}!`;
      
      const loginUrl = `${supabaseUrl.replace('.supabase.co', '.lovableproject.com')}/auth`;
      
      const bodyContent = `
        ${generateContentCard(`
          <h2 style="color: #4B0F23; margin: 0 0 16px 0; font-size: 24px;">Congratulations, ${manager_name}!</h2>
          <p style="margin: 0 0 16px 0; line-height: 1.6;">
            We're thrilled to inform you that your manager profile for <strong>${company_name}</strong> has been approved!
          </p>
          <p style="margin: 0 0 16px 0; line-height: 1.6;">
            Your company is now listed on Movingto Funds, Portugal's leading platform for investment fund discovery.
          </p>
        `, 'bordeaux')}
        
        <div style="margin: 32px 0;">
          <h3 style="color: #4B0F23; margin: 0 0 16px 0; font-size: 18px;">What's Next?</h3>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Log in to your manager dashboard</li>
            <li>Complete your company profile</li>
            <li>Add and manage your funds</li>
            <li>Track investor enquiries and analytics</li>
          </ul>
        </div>

        ${generateCTAButton('Access Manager Dashboard', loginUrl, 'bordeaux')}

        <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
          If you have any questions or need assistance, our team is here to help. Simply reply to this email.
        </p>
      `;

      htmlContent = generateEmailWrapper(subject, bodyContent, email);
      plainTextContent = generatePlainTextEmail(
        subject,
        `Congratulations, ${manager_name}!\n\nYour manager profile for ${company_name} has been approved. You can now access your manager dashboard and start managing your funds.\n\nBest regards,\nThe Movingto Funds Team`,
        'Access Manager Dashboard',
        loginUrl
      );
    } else {
      // Rejection email
      subject = `Update on Your Manager Application - ${company_name}`;
      
      const bodyContent = `
        ${generateContentCard(`
          <h2 style="color: #4B0F23; margin: 0 0 16px 0; font-size: 24px;">Application Update</h2>
          <p style="margin: 0 0 16px 0; line-height: 1.6;">
            Dear ${manager_name},
          </p>
          <p style="margin: 0 0 16px 0; line-height: 1.6;">
            Thank you for your interest in joining Movingto Funds. After careful review, we're unable to approve your manager profile at this time.
          </p>
          ${rejection_reason ? `
          <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; color: #991B1B; font-weight: 500;">Reason:</p>
            <p style="margin: 8px 0 0 0; color: #991B1B;">${rejection_reason}</p>
          </div>
          ` : ''}
          <p style="margin: 16px 0 0 0; line-height: 1.6;">
            If you believe this decision was made in error or would like to provide additional information, please don't hesitate to reach out to our team.
          </p>
        `)}
        
        <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
          Thank you for your understanding.
        </p>
      `;

      htmlContent = generateEmailWrapper(subject, bodyContent, email);
      plainTextContent = generatePlainTextEmail(
        subject,
        `Dear ${manager_name},\n\nThank you for your interest in Movingto Funds. We're unable to approve your manager profile at this time.\n\n${rejection_reason ? `Reason: ${rejection_reason}\n\n` : ''}If you have questions, please reply to this email.\n\nBest regards,\nThe Movingto Funds Team`
      );
    }

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
        To: email,
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
    console.log("Email sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, messageId: result.MessageId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in notify-manager-approval:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});