import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FundBriefRequest {
  userEmail: string;
  fundName: string;
  fundId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, fundName, fundId }: FundBriefRequest = await req.json();
    
    const gmailEmail = Deno.env.get("GMAIL_EMAIL");
    const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!gmailEmail || !gmailAppPassword) {
      console.error("Gmail credentials not configured");
      return new Response(
        JSON.stringify({ 
          error: "Email service not configured" 
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log('Sending fund brief for:', fundName, 'to:', userEmail);

    // Set up SMTP client
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

    // Create fund brief email content
    const textContent = `
Fund Brief Request: ${fundName}

Thank you for your interest in ${fundName}!

We've received your request for the fund brief. Our team will prepare the detailed information and send it to you within 24 hours.

What's Next?
- Our investment team will compile the latest fund information
- You'll receive a comprehensive PDF brief via email  
- The brief includes performance data, strategy details, and key terms
- If you have questions, you can book a call with our team

View Fund Details: https://funds.movingto.com/fund/${fundId}

Best regards,
Investment Funds Platform Team
    `.trim();

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fund Brief Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
<h1 style="margin: 0; font-size: 24px;">Fund Brief Request</h1>
<p style="margin: 10px 0 0 0; opacity: 0.9;">Your requested fund information</p>
</div>
<div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
<h2 style="color: #1e293b; margin-top: 0;">${fundName}</h2>
<div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3b82f6;">
<p style="margin: 0;"><strong>Thank you for your interest in ${fundName}!</strong></p>
<p style="margin: 10px 0 0 0;">We've received your request for the fund brief. Our team will prepare the detailed information and send it to you within 24 hours.</p>
</div>
<div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
<h3 style="margin-top: 0; color: #1e293b;">What's Next?</h3>
<ul style="margin: 0; padding-left: 20px;">
<li>Our investment team will compile the latest fund information</li>
<li>You'll receive a comprehensive PDF brief via email</li>
<li>The brief includes performance data, strategy details, and key terms</li>
<li>If you have questions, you can book a call with our team</li>
</ul>
</div>
<div style="text-align: center; margin: 30px 0;">
<a href="https://funds.movingto.com/fund/${fundId}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">View Fund Details</a>
</div>
<div style="text-align: center; padding: 20px 0; border-top: 1px solid #e2e8f0; margin-top: 30px;">
<p style="margin: 0; color: #64748b; font-size: 14px;">Best regards,<br><strong>Investment Funds Platform Team</strong></p>
</div>
</div>
</body>
</html>`;

    // Send the fund brief request confirmation email
    await client.send({
      from: `Investment Funds Platform <${gmailEmail}>`,
      to: userEmail,
      subject: `Fund Brief Request: ${fundName}`,
      html,
      content: textContent,
    });

    console.log(`✅ Fund brief request email sent successfully to:`, userEmail);
    await client.close();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Fund brief request sent successfully",
        recipient: userEmail,
        fundName: fundName,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error sending fund brief email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to send fund brief request", 
        error: error?.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);