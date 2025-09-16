import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  fundId: string;
  status: "approved" | "rejected";
  rejectionReason?: string;
  managerName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, fundId, status, rejectionReason, managerName }: EmailRequest = await req.json();

    console.log(`Processing email notification: ${status} for ${fundId} to ${to}`);

    // We keep these for reply-to convenience, but we DO NOT send via SMTP from Edge
    const gmailEmail = Deno.env.get("GMAIL_EMAIL") || "";

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured. Cannot send emails from Edge without a provider.");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email provider not configured (RESEND_API_KEY missing).",
          hint: "Add RESEND_API_KEY in Supabase Edge Function secrets.",
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const resend = new Resend(resendApiKey);

    // Create email content based on status
    let emailBody = "";
    let emailSubject = subject;

    if (status === "approved") {
      emailSubject = `✅ Fund Edit Approved - ${fundId}`;
      emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Fund Edit Suggestion Approved ✅</h2>
          <p>Dear ${managerName || "Fund Manager"},</p>
          <p>Great news! Your edit suggestion for fund <strong>${fundId}</strong> has been <span style="color: #16a34a; font-weight: bold;">approved</span> and applied to the platform.</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
            <p style="margin: 0;"><strong>Fund ID:</strong> ${fundId}</p>
            <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Approved and Published</p>
          </div>
          <p>Thank you for helping us keep the fund information accurate and up-to-date. Your contributions help investors make better informed decisions.</p>
          <p>Best regards,<br>The Investment Funds Team</p>
        </div>
      `;
    } else {
      emailSubject = `❌ Fund Edit Rejected - ${fundId}`;
      emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Fund Edit Suggestion Rejected ❌</h2>
          <p>Dear ${managerName || "Fund Manager"},</p>
          <p>Unfortunately, your edit suggestion for fund <strong>${fundId}</strong> has been <span style="color: #dc2626; font-weight: bold;">rejected</span>.</p>
          <div style="background-color: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
            <p style="margin: 0;"><strong>Fund ID:</strong> ${fundId}</p>
            <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Rejected</p>
            ${rejectionReason ? `<p style="margin: 10px 0 0 0;"><strong>Reason:</strong> ${rejectionReason}</p>` : ""}
          </div>
          <p>You can submit a new suggestion with the requested changes if needed. Please review the feedback provided and feel free to resubmit with the necessary adjustments.</p>
          <p>Best regards,<br>The Investment Funds Team</p>
        </div>
      `;
    }

    console.log("=== SENDING EMAIL via Resend ===");
    console.log("To:", to);
    console.log("Subject:", emailSubject);
    console.log("Fund ID:", fundId);
    console.log("Status:", status);

    // Attempt sending with your domain first (if verified), fallback to resend.dev
    const primaryFrom = "MovingTo <noreply@movingto.com>"; // requires domain verification in Resend
    const fallbackFrom = "MovingTo <onboarding@resend.dev>"; // works without domain verification

    try {
      const firstAttempt = await resend.emails.send({
        from: primaryFrom,
        to: [to],
        subject: emailSubject,
        html: emailBody,
        reply_to: gmailEmail || undefined,
      });

      if ((firstAttempt as any)?.error) {
        throw new Error((firstAttempt as any).error?.message || "Unknown Resend error on primary from");
      }

      console.log("✅ Email sent successfully via Resend (primary domain)", firstAttempt);
      return new Response(
        JSON.stringify({
          success: true,
          message: "Email notification sent successfully",
          recipient: to,
          subject: emailSubject,
          provider: "Resend",
          from: primaryFrom,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } catch (primaryErr) {
      console.warn("Primary send failed, attempting fallback sender:", String((primaryErr as any)?.message || primaryErr));
      try {
        const secondAttempt = await resend.emails.send({
          from: fallbackFrom,
          to: [to],
          subject: emailSubject,
          html: emailBody,
          reply_to: gmailEmail || undefined,
        });

        if ((secondAttempt as any)?.error) {
          throw new Error((secondAttempt as any).error?.message || "Unknown Resend error on fallback from");
        }

        console.log("✅ Email sent successfully via Resend (fallback)", secondAttempt);
        return new Response(
          JSON.stringify({
            success: true,
            message: "Email notification sent successfully (fallback sender)",
            recipient: to,
            subject: emailSubject,
            provider: "Resend",
            from: fallbackFrom,
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      } catch (fallbackErr) {
        console.error("Email sending failed on both attempts:", String((fallbackErr as any)?.message || fallbackErr));
        return new Response(
          JSON.stringify({
            success: false,
            message: "Email sending failed. Check Edge Function logs for details.",
            recipient: to,
            subject: emailSubject,
            error: String((fallbackErr as any)?.message || fallbackErr),
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }
  } catch (error: any) {
    console.error("Error handling request:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Invalid request payload", error: error?.message }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
