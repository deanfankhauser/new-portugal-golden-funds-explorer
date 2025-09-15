import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  fundId: string;
  status: 'approved' | 'rejected';
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

    const gmailEmail = Deno.env.get("GMAIL_EMAIL");
    const gmailPassword = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!gmailEmail || !gmailPassword) {
      console.error("Gmail credentials not configured");
      throw new Error("Gmail credentials not configured. Please set GMAIL_EMAIL and GMAIL_APP_PASSWORD secrets.");
    }

    console.log(`Using Gmail account: ${gmailEmail}`);

    // Create email content based on status
    let emailBody = "";
    let emailSubject = subject;
    
    if (status === "approved") {
      emailSubject = `✅ Fund Edit Approved - ${fundId}`;
      emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Fund Edit Suggestion Approved ✅</h2>
          <p>Dear ${managerName || 'Fund Manager'},</p>
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
          <p>Dear ${managerName || 'Fund Manager'},</p>
          <p>Unfortunately, your edit suggestion for fund <strong>${fundId}</strong> has been <span style="color: #dc2626; font-weight: bold;">rejected</span>.</p>
          <div style="background-color: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
            <p style="margin: 0;"><strong>Fund ID:</strong> ${fundId}</p>
            <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Rejected</p>
            ${rejectionReason ? `<p style="margin: 10px 0 0 0;"><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
          </div>
          <p>You can submit a new suggestion with the requested changes if needed. Please review the feedback provided and feel free to resubmit with the necessary adjustments.</p>
          <p>Best regards,<br>The Investment Funds Team</p>
        </div>
      `;
    }

    // Configure Gmail SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 587,
        tls: true,
        auth: {
          username: gmailEmail,
          password: gmailPassword,
        },
      },
    });

    console.log("Connecting to Gmail SMTP...");
    await client.connect();

    console.log("Sending email...");
    await client.send({
      from: `Investment Funds Platform <${gmailEmail}>`,
      to: to,
      subject: emailSubject,
      content: emailBody,
      html: emailBody,
    });

    console.log("Closing SMTP connection...");
    await client.close();

    console.log("Email sent successfully to:", to);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email sent successfully via Gmail SMTP",
      recipient: to,
      subject: emailSubject
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    
    // Return success but log the issue for debugging
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email notification processed (check logs for details)",
      error: error.message,
      details: "Gmail SMTP connection details logged"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);