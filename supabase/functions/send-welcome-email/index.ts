import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { WelcomeEmail } from '../send-confirmation-email/_templates/welcome-email.tsx';

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

    // Render the React email template
    const html = await renderAsync(
      React.createElement(WelcomeEmail, {
        userEmail: email,
        loginUrl: finalLoginUrl,
      })
    );

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