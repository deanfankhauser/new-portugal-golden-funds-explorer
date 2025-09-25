import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { withSecurity, validateEmail } from '../_shared/security.ts';

interface ConfirmationEmailData {
  confirmationUrl: string;
  userEmail: string;
  isRecovery: boolean;
}

function generateConfirmationEmailHTML({ confirmationUrl, userEmail, isRecovery }: ConfirmationEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${isRecovery ? 'Password Reset' : 'Email Confirmation'} - Investment Funds Platform</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; margin-bottom: 64px;">
        <div style="padding: 32px 24px; text-align: center;">
          <h1 style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0;">
            ${isRecovery ? 'Password Reset Request' : 'Welcome to Investment Funds Platform'}
          </h1>
        </div>
        
        <div style="padding: 0 24px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0;">Hello,</p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0;">
            ${isRecovery 
              ? 'We received a request to reset your password for your Investment Funds Platform account.'
              : 'Thank you for signing up for Investment Funds Platform! To complete your account setup, please confirm your email address.'
            }
          </p>

          <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0;">
            ${isRecovery 
              ? 'Click the button below to reset your password:' 
              : 'Click the button below to confirm your email:'
            }
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${confirmationUrl}" style="background-color: #3b82f6; border-radius: 6px; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; text-align: center; display: inline-block; padding: 12px 24px; max-width: 200px;">
              ${isRecovery ? 'Reset My Password' : 'Confirm Email Address'}
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin: 16px 0 8px;">
            Or copy and paste this link in your browser:
          </p>
          <a href="${confirmationUrl}" style="color: #3b82f6; font-size: 12px; text-decoration: underline; word-break: break-all;">
            ${confirmationUrl}
          </a>

          <hr style="border-color: #e5e7eb; margin: 32px 0;" />

          <div style="margin-top: 32px;">
            <p style="color: #6b7280; font-size: 12px; line-height: 1.4; margin: 8px 0;">
              <strong>Security Notice:</strong> This ${isRecovery ? 'reset' : 'confirmation'} link will expire in 1 hour. 
              If you didn't ${isRecovery ? 'request a password reset' : 'create an account'}, 
              please ignore this email or contact support.
            </p>
            
            <p style="color: #6b7280; font-size: 12px; line-height: 1.4; margin: 8px 0;">
              Investment Funds Platform<br />
              This email was sent to ${userEmail}
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET');
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

    // Parse the webhook payload
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    
    let webhookData;
    
    if (hookSecret) {
      // Use webhook verification if secret is provided
      const wh = new Webhook(hookSecret);
      webhookData = wh.verify(payload, headers) as {
        user: { email: string };
        email_data: {
          token: string;
          token_hash: string;
          redirect_to: string;
          email_action_type: string;
          site_url: string;
        };
      };
    } else {
      // Parse as JSON if no webhook secret (for testing)
      webhookData = JSON.parse(payload);
    }

    const {
      user,
      email_data: { token_hash, redirect_to, email_action_type, site_url },
    } = webhookData;

    // Validate email
    if (!validateEmail(user.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log('Processing confirmation email:', {
      email: user.email,
      type: email_action_type,
      redirect_to,
    });

    // Determine if this is a recovery email
    const isRecovery = email_action_type === 'recovery';
    
    // Build the confirmation URL using Supabase verify endpoint with correct token param
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || site_url;
    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token_hash=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to)}`;

    // Generate HTML email template
    const html = generateConfirmationEmailHTML({
      confirmationUrl,
      userEmail: user.email,
      isRecovery,
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

    // Send the email
    const subject = isRecovery 
      ? "Password Reset Request - Investment Funds Platform"
      : "Confirm Your Email - Investment Funds Platform";

    await client.send({
      from: `Investment Funds Platform <${gmailEmail}>`,
      to: user.email,
      subject,
      html,
    });

    console.log(`✅ ${isRecovery ? 'Recovery' : 'Confirmation'} email sent successfully to:`, user.email);
    await client.close();

    return new Response(
      JSON.stringify({
        success: true,
        message: `${isRecovery ? 'Recovery' : 'Confirmation'} email sent successfully`,
        recipient: user.email,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to send confirmation email", 
        error: error?.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

serve(withSecurity(handler));