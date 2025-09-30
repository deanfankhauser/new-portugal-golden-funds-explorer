import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

interface WelcomeEmailData {
  userEmail: string;
  loginUrl: string;
}

function generateWelcomeEmailHTML({ userEmail, loginUrl }: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to Investment Funds Platform</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0;">
<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; margin-bottom: 64px;">
<div style="padding: 32px 24px; text-align: center;">
<h1 style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0;">Welcome to Investment Funds Platform!</h1>
</div>
<div style="padding: 0 24px;">
<p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0;">Hello and welcome to the Investment Funds Platform!</p>
<p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0;">Your account has been successfully created. You now have access to our comprehensive database of investment funds, detailed analysis tools, and comparison features.</p>
<p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0;"><strong>What you can do:</strong></p>
<ul style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0; padding-left: 20px;">
<li>Browse and search our extensive fund database</li>
<li>Compare funds side-by-side</li>
<li>Save funds to your personal shortlist</li>
<li>Access detailed performance analytics</li>
<li>Get personalized fund recommendations</li>
</ul>
<div style="text-align: center; margin: 32px 0;">
<a href="${loginUrl}" style="background-color: #3b82f6; border-radius: 6px; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; text-align: center; display: inline-block; padding: 12px 24px;">Get Started</a>
</div>
<hr style="border-color: #e5e7eb; margin: 32px 0;" />
<div style="margin-top: 32px;">
<p style="color: #6b7280; font-size: 12px; line-height: 1.4; margin: 8px 0;">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
<p style="color: #6b7280; font-size: 12px; line-height: 1.4; margin: 8px 0;">Movingto Team<br />This email was sent to ${userEmail}</p>
</div>
</div>
</div>
</body>
</html>`;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeRequest {
  email: string;
  loginUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, loginUrl }: WelcomeRequest = await req.json();
    
    const gmailEmail = Deno.env.get("GMAIL_EMAIL");
    const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD");
    const baseUrl = Deno.env.get("SUPABASE_URL") || "https://funds.movingto.com";

    if (!gmailEmail || !gmailAppPassword) {
      console.error("Gmail credentials not configured");
      return new Response(
        JSON.stringify({ 
          error: "Email service not configured" 
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log('Sending welcome email to:', email);

    // Use provided login URL or default to home page
    const finalLoginUrl = loginUrl || `${baseUrl}/`;

    // Generate HTML email template
    const html = generateWelcomeEmailHTML({
      userEmail: email,
      loginUrl: finalLoginUrl,
    });

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

    // Send the welcome email
    await client.send({
      from: `Investment Funds Platform <${gmailEmail}>`,
      to: email,
      subject: "Welcome to Investment Funds Platform! 🎉",
      html,
    });

    console.log(`✅ Welcome email sent successfully to:`, email);
    await client.close();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Welcome email sent successfully",
        recipient: email,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to send welcome email", 
        error: error?.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);