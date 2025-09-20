import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { withSecurity, validateEmail, sanitizeString } from '../_shared/security.ts';

interface EmailRequest {
  to: string;
  subject: string;
  fundId: string;
  status: "approved" | "rejected";
  rejectionReason?: string;
  managerName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  try {
    const { to, subject, fundId, status, rejectionReason, managerName }: EmailRequest = await req.json();
    
    // Validate inputs
    if (!validateEmail(to)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const safeFundId = sanitizeString(fundId, 100);
    const safeSubject = sanitizeString(subject, 200);
    const safeManagerName = managerName ? sanitizeString(managerName, 100) : undefined;
    const safeRejectionReason = rejectionReason ? sanitizeString(rejectionReason, 500) : undefined;

    console.log(`Processing email notification: ${status} for ${safeFundId} to ${to}`);

    const gmailEmail = Deno.env.get("GMAIL_EMAIL") || "";
    const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD") || "";

    if (!gmailEmail || !gmailAppPassword) {
      console.error("Gmail credentials not configured. Cannot send emails from Edge without credentials.");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email provider not configured (Gmail credentials missing).",
          hint: "Add GMAIL_EMAIL and GMAIL_APP_PASSWORD in Supabase Edge Function secrets.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: gmailEmail,
          password: gmailAppPassword,
        },
      },
    });

    // Create email content based on status
    let emailBody = "";
    let emailSubject = safeSubject;

    if (status === "approved") {
      emailSubject = `✅ Fund Edit Approved - ${safeFundId}`;
      emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Fund Edit Suggestion Approved ✅</h2>
          <p>Dear ${safeManagerName || "Fund Manager"},</p>
          <p>Great news! Your edit suggestion for fund <strong>${safeFundId}</strong> has been <span style="color: #16a34a; font-weight: bold;">approved</span> and applied to the platform.</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
            <p style="margin: 0;"><strong>Fund ID:</strong> ${safeFundId}</p>
            <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Approved and Published</p>
          </div>
          <p>Thank you for helping us keep the fund information accurate and up-to-date. Your contributions help investors make better informed decisions.</p>
          <p>Best regards,<br>The Investment Funds Team</p>
        </div>
      `;
    } else {
      emailSubject = `❌ Fund Edit Rejected - ${safeFundId}`;
      emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Fund Edit Suggestion Rejected ❌</h2>
          <p>Dear ${safeManagerName || "Fund Manager"},</p>
          <p>Unfortunately, your edit suggestion for fund <strong>${safeFundId}</strong> has been <span style="color: #dc2626; font-weight: bold;">rejected</span>.</p>
          <div style="background-color: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
            <p style="margin: 0;"><strong>Fund ID:</strong> ${safeFundId}</p>
            <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Rejected</p>
            ${safeRejectionReason ? `<p style="margin: 10px 0 0 0;"><strong>Reason:</strong> ${safeRejectionReason}</p>` : ""}
          </div>
          <p>You can submit a new suggestion with the requested changes if needed. Please review the feedback provided and feel free to resubmit with the necessary adjustments.</p>
          <p>Best regards,<br>The Investment Funds Team</p>
        </div>
      `;
    }

    console.log("=== SENDING EMAIL via Gmail SMTP ===");
    console.log("To:", to);
    console.log("Subject:", emailSubject);
    console.log("Fund ID:", safeFundId);
    console.log("Status:", status);

    try {
      await client.send({
        from: gmailEmail,
        to: to,
        subject: emailSubject,
        html: emailBody,
      });

      console.log("✅ Email sent successfully via Gmail SMTP");
      await client.close();
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Email notification sent successfully",
          recipient: to,
          subject: emailSubject,
          provider: "Gmail SMTP",
          from: gmailEmail,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Email sending failed:", String((error as any)?.message || error));
      await client.close();
      
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email sending failed. Check Edge Function logs for details.",
          recipient: to,
          subject: emailSubject,
          error: String((error as any)?.message || error),
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error: any) {
    console.error("Error handling request:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Invalid request payload", error: error?.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

serve(withSecurity(handler));
