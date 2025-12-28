import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import {
  generateFundSubmissionConfirmationEmail,
  generateFundSubmissionAdminAlertEmail,
  COMPANY_INFO,
} from "../_shared/email-templates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FundSubmissionNotificationRequest {
  submissionId: string;
  companyName: string;
  fundName: string;
  contactName: string;
  contactEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const postmarkToken = Deno.env.get("POSTMARK_SERVER_TOKEN");

    if (!postmarkToken) {
      console.error("Missing POSTMARK_SERVER_TOKEN");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestData: FundSubmissionNotificationRequest = await req.json();
    const { submissionId, companyName, fundName, contactName, contactEmail } = requestData;

    console.log("Processing fund submission notification:", { submissionId, companyName, fundName });

    // 1. Send confirmation email to the submitter
    const confirmationEmail = generateFundSubmissionConfirmationEmail({
      companyName,
      fundName,
      contactName,
      recipientEmail: contactEmail,
    });

    const confirmationResponse = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify({
        From: `${COMPANY_INFO.tradingName} <${COMPANY_INFO.email}>`,
        To: contactEmail,
        Subject: "Fund Submission Received - Movingto Funds",
        HtmlBody: confirmationEmail.html,
        TextBody: confirmationEmail.text,
        MessageStream: "outbound",
      }),
    });

    if (!confirmationResponse.ok) {
      const errorText = await confirmationResponse.text();
      console.error("Failed to send confirmation email:", errorText);
    } else {
      console.log("Confirmation email sent to:", contactEmail);
    }

    // 2. Get super admin emails
    const { data: adminEmails, error: adminError } = await supabase
      .rpc("get_super_admin_emails");

    if (adminError) {
      console.error("Error fetching admin emails:", adminError);
    } else if (adminEmails && adminEmails.length > 0) {
      // Send alert to each super admin
      for (const admin of adminEmails) {
        const alertEmail = generateFundSubmissionAdminAlertEmail({
          companyName,
          fundName,
          contactName,
          contactEmail,
          submissionId,
          recipientEmail: admin.email,
        });

        const alertResponse = await fetch("https://api.postmarkapp.com/email", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Postmark-Server-Token": postmarkToken,
          },
          body: JSON.stringify({
            From: `${COMPANY_INFO.tradingName} <${COMPANY_INFO.email}>`,
            To: admin.email,
            Subject: `New Fund Submission: ${companyName} - ${fundName}`,
            HtmlBody: alertEmail.html,
            TextBody: alertEmail.text,
            MessageStream: "outbound",
          }),
        });

        if (!alertResponse.ok) {
          const errorText = await alertResponse.text();
          console.error("Failed to send admin alert to:", admin.email, errorText);
        } else {
          console.log("Admin alert sent to:", admin.email);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notifications sent" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in notify-fund-submission:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
