import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { withSecurity, validateEmail } from '../_shared/security.ts';
import { 
  generateEmailWrapper, 
  generateContentCard, 
  generateCTAButton,
  generatePlainTextEmail 
} from "../_shared/email-templates.ts";

interface ConfirmationEmailData {
  confirmationUrl: string;
  userEmail: string;
  isRecovery: boolean;
}

function generateConfirmationEmailHTML({ confirmationUrl, userEmail, isRecovery }: ConfirmationEmailData): string {
  const title = isRecovery ? 'Reset Your Password' : 'Confirm Your Email';
  const greeting = isRecovery 
    ? 'We received a request to reset your password for your Movingto Funds account.'
    : 'Thank you for signing up for Movingto Funds! To complete your account setup, please confirm your email address.';
  const description = isRecovery 
    ? 'Click the button below to reset your password. This link will expire in 1 hour.' 
    : 'Click the button below to confirm your email address and start exploring investment opportunities.';
  const buttonText = isRecovery ? 'Reset My Password' : 'Confirm Email Address';

  const contentCard = generateContentCard(`
    <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0;">Hello,</p>
    <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0;">${greeting}</p>
    <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0;">${description}</p>
    ${generateCTAButton(buttonText, confirmationUrl, 'bordeaux')}
    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 24px 0 0 0; text-align: center;">
      Or copy and paste this link in your browser:<br/>
      <a href="${confirmationUrl}" style="color: hsl(340 66% 18%); word-break: break-all;">${confirmationUrl}</a>
    </p>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 16px 0 0 0; text-align: center;">
      <strong>Security Notice:</strong> This ${isRecovery ? 'reset' : 'confirmation'} link will expire in 1 hour. 
      If you didn't ${isRecovery ? 'request a password reset' : 'create an account'}, 
      please ignore this email.
    </p>
  `, 'bordeaux');

  return generateEmailWrapper(title, contentCard, userEmail);
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

    // Generate plain text version
    const plainText = generatePlainTextEmail(
      isRecovery ? 'Reset Your Password' : 'Confirm Your Email',
      isRecovery 
        ? 'We received a request to reset your password for your Movingto Funds account.' 
        : 'Thank you for signing up for Movingto Funds! To complete your account setup, please confirm your email address.',
      isRecovery ? 'Reset My Password' : 'Confirm Email Address',
      confirmationUrl
    );

    // Send the email
    const subject = isRecovery 
      ? "Password Reset Request - Movingto Funds"
      : "Confirm Your Email - Movingto Funds";

    await client.send({
      from: `Movingto Funds <${gmailEmail}>`,
      to: user.email,
      subject,
      html,
      plainText,
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