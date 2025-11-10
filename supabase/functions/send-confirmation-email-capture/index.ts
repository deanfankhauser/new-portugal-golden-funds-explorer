import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailCaptureRequest {
  email: string;
  source?: string;
  user_agent?: string;
  referrer_url?: string;
  tags?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, source = 'exit_intent', user_agent, referrer_url, tags = [] }: EmailCaptureRequest = await req.json();

    // Input validation
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Trim and lowercase email
    const normalizedEmail = email.trim().toLowerCase();

    // Length validation
    if (normalizedEmail.length > 255) {
      return new Response(
        JSON.stringify({ error: 'Email address is too long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if email already exists
    const { data: existingEmail, error: checkError } = await supabase
      .from('email_captures')
      .select('status, confirmation_token')
      .eq('email', normalizedEmail)
      .single();

    let confirmationToken: string;
    let isNewCapture = false;

    if (existingEmail) {
      // Email exists
      if (existingEmail.status === 'confirmed') {
        return new Response(
          JSON.stringify({ 
            message: 'This email is already confirmed and subscribed.',
            status: 'already_confirmed'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (existingEmail.status === 'unsubscribed') {
        return new Response(
          JSON.stringify({ 
            message: 'This email has previously unsubscribed.',
            status: 'unsubscribed'
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Email exists but pending - use existing token and resend
      confirmationToken = existingEmail.confirmation_token;
      console.log(`Resending confirmation email to: ${normalizedEmail}`);
    } else {
      // New email - insert into database
      const { data: newCapture, error: insertError } = await supabase
        .from('email_captures')
        .insert({
          email: normalizedEmail,
          source: source,
          user_agent: user_agent ? user_agent.substring(0, 500) : null,
          referrer_url: referrer_url ? referrer_url.substring(0, 1000) : null,
          tags: tags,
          status: 'pending_confirmation'
        })
        .select('confirmation_token')
        .single();

      if (insertError) {
        console.error('Error inserting email capture:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to save email' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      confirmationToken = newCapture.confirmation_token;
      isNewCapture = true;
      console.log(`New email capture: ${normalizedEmail}`);
    }

    // Send confirmation email via Postmark
    const postmarkToken = Deno.env.get('POSTMARK_SERVER_TOKEN');
    if (!postmarkToken) {
      console.error('POSTMARK_SERVER_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const confirmationUrl = `https://funds.movingto.com/confirm-email?token=${confirmationToken}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your subscription</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">Confirm your subscription</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px; color: #4b5563;">
                Thank you for subscribing to Movingto Funds! We'll keep you updated with the latest Golden Visa fund opportunities and investment insights.
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 24px; color: #4b5563;">
                Please confirm your email address by clicking the button below:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td align="center">
                    <a href="${confirmationUrl}" style="display: inline-block; padding: 14px 32px; background-color: hsl(340 66% 18%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Confirm Email Address
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 8px 0 0; font-size: 14px; line-height: 20px; color: #6b7280; word-break: break-all;">
                <a href="${confirmationUrl}" style="color: hsl(340 66% 18%);">${confirmationUrl}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; font-size: 12px; line-height: 18px; color: #9ca3af;">
                If you didn't request this email, you can safely ignore it.
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #9ca3af;">
                © ${new Date().getFullYear()} Movingto Funds. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const emailText = `
Confirm your subscription to Movingto Funds

Thank you for subscribing! We'll keep you updated with the latest Golden Visa fund opportunities and investment insights.

Please confirm your email address by clicking this link:
${confirmationUrl}

If you didn't request this email, you can safely ignore it.

© ${new Date().getFullYear()} Movingto Funds
    `;

    const postmarkResponse = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': postmarkToken,
      },
      body: JSON.stringify({
        From: 'Movingto Funds <noreply@funds.movingto.com>',
        To: normalizedEmail,
        Subject: 'Confirm your subscription - Movingto Funds',
        HtmlBody: emailHtml,
        TextBody: emailText,
        MessageStream: 'outbound',
      }),
    });

    if (!postmarkResponse.ok) {
      const errorText = await postmarkResponse.text();
      console.error('Postmark API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send confirmation email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Confirmation email sent successfully to: ${normalizedEmail}`);

    return new Response(
      JSON.stringify({ 
        message: 'Confirmation email sent! Please check your inbox.',
        status: isNewCapture ? 'new_capture' : 'resent',
        email: normalizedEmail
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-confirmation-email-capture:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
