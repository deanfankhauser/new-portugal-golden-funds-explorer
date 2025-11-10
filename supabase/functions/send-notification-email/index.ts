import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { withSecurity, validateEmail, sanitizeString } from '../_shared/security.ts';
import { 
  BRAND_COLORS, 
  COMPANY_INFO, 
  generateEmailWrapper, 
  generateContentCard,
  generatePlainTextEmail 
} from "../_shared/email-templates.ts";

interface EmailRequest {
  to: string;
  subject: string;
  fundId: string;
  status: "approved" | "rejected" | "submitted";
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

    // Create branded email content based on status
    let bodyContent = "";
    let emailSubject = safeSubject;
    let plainTextMessage = "";

    if (status === "submitted") {
      emailSubject = `Fund Edit Submission Received - ${safeFundId}`;
      bodyContent = `
        <h2 style="color: ${BRAND_COLORS.bordeaux}; margin-top: 0;">Thank You for Your Submission! 📝</h2>
        <p style="color: ${BRAND_COLORS.textDark}; font-size: 16px;">Dear ${safeManagerName || "Fund Manager"},</p>
        <p style="color: ${BRAND_COLORS.textDark};">Thank you for submitting an edit suggestion for fund <strong>${safeFundId}</strong>. We have received your submission and it's now under review.</p>
        
        ${generateContentCard(`
          <p style="margin: 0;"><strong>Fund ID:</strong> ${safeFundId}</p>
          <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Under Review</p>
        `, 'bronze')}
        
        <p style="color: ${BRAND_COLORS.textDark};">We'll notify you as soon as our team reviews your submission. Typically, this process takes 1-2 business days.</p>
        <p style="color: ${BRAND_COLORS.textDark};">Thank you for helping us maintain accurate and up-to-date fund information!</p>
      `;
      plainTextMessage = `Dear ${safeManagerName || "Fund Manager"},

Thank you for submitting an edit suggestion for fund ${safeFundId}. We have received your submission and it's now under review.

We'll notify you as soon as our team reviews your submission. Typically, this process takes 1-2 business days.`;
    } else if (status === "approved") {
      emailSubject = `✅ Fund Edit Approved - ${safeFundId}`;
      bodyContent = `
        <h2 style="color: ${BRAND_COLORS.bordeaux}; margin-top: 0;">Fund Edit Suggestion Approved ✅</h2>
        <p style="color: ${BRAND_COLORS.textDark}; font-size: 16px;">Dear ${safeManagerName || "Fund Manager"},</p>
        <p style="color: ${BRAND_COLORS.textDark};">Great news! Your edit suggestion for fund <strong>${safeFundId}</strong> has been <span style="color: ${BRAND_COLORS.bronze}; font-weight: bold;">approved</span> and applied to the platform.</p>
        
        ${generateContentCard(`
          <p style="margin: 0;"><strong>Fund ID:</strong> ${safeFundId}</p>
          <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Approved and Published</p>
        `, 'bronze')}
        
        <p style="color: ${BRAND_COLORS.textDark};">Thank you for helping us keep the fund information accurate and up-to-date. Your contributions help investors make better informed decisions.</p>
      `;
      plainTextMessage = `Dear ${safeManagerName || "Fund Manager"},

Great news! Your edit suggestion for fund ${safeFundId} has been approved and applied to the platform.

Thank you for helping us keep the fund information accurate and up-to-date.`;
    } else {
      emailSubject = `Fund Edit Rejected - ${safeFundId}`;
      bodyContent = `
        <h2 style="color: ${BRAND_COLORS.bordeaux}; margin-top: 0;">Fund Edit Suggestion Rejected ❌</h2>
        <p style="color: ${BRAND_COLORS.textDark}; font-size: 16px;">Dear ${safeManagerName || "Fund Manager"},</p>
        <p style="color: ${BRAND_COLORS.textDark};">Unfortunately, your edit suggestion for fund <strong>${safeFundId}</strong> has been <span style="color: ${BRAND_COLORS.bordeaux}; font-weight: bold;">rejected</span>.</p>
        
        ${generateContentCard(`
          <p style="margin: 0;"><strong>Fund ID:</strong> ${safeFundId}</p>
          <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Rejected</p>
          ${safeRejectionReason ? `<p style="margin: 10px 0 0 0;"><strong>Reason:</strong> ${safeRejectionReason}</p>` : ""}
        `, 'bordeaux')}
        
        <p style="color: ${BRAND_COLORS.textDark};">You can submit a new suggestion with the requested changes if needed. Please review the feedback provided and feel free to resubmit with the necessary adjustments.</p>
      `;
      plainTextMessage = `Dear ${safeManagerName || "Fund Manager"},

Unfortunately, your edit suggestion for fund ${safeFundId} has been rejected.

${safeRejectionReason ? `Reason: ${safeRejectionReason}` : ''}

You can submit a new suggestion with the requested changes if needed.`;
    }

    const html = generateEmailWrapper(emailSubject, bodyContent, to);
    const textContent = generatePlainTextEmail(emailSubject, plainTextMessage);

    console.log("=== SENDING EMAIL via Gmail SMTP ===");
    console.log("To:", to);
    console.log("Subject:", emailSubject);

    try {
      await client.send({
        from: `${COMPANY_INFO.tradingName} <${gmailEmail}>`,
        to: to,
        subject: emailSubject,
        html: html,
        content: textContent,
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
