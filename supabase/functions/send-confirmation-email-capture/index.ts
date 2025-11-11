import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { 
  generateEmailWrapper, 
  generateContentCard, 
  generateCTAButton,
  generatePlainTextEmail 
} from "../_shared/email-templates.ts";

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

    const emailHtml = generateEmailWrapper(
      'Confirm your subscription',
      generateContentCard(`
        <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0;">
          Thank you for subscribing to Movingto Funds! We'll keep you updated with the latest Golden Visa fund opportunities and investment insights.
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0;">
          Please confirm your email address by clicking the button below:
        </p>
        ${generateCTAButton('Confirm Email Address', confirmationUrl, 'bordeaux')}
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 24px 0 0 0; text-align: center;">
          Or copy and paste this link into your browser:<br/>
          <a href="${confirmationUrl}" style="color: hsl(340 66% 18%); word-break: break-all;">${confirmationUrl}</a>
        </p>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 16px 0 0 0; text-align: center;">
          If you didn't request this email, you can safely ignore it.
        </p>
      `, 'bordeaux'),
      normalizedEmail
    );

    const emailText = generatePlainTextEmail(
      'Confirm your subscription to Movingto Funds',
      "Thank you for subscribing! We'll keep you updated with the latest Golden Visa fund opportunities and investment insights.",
      'Confirm Email Address',
      confirmationUrl
    );

    const postmarkResponse = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': postmarkToken,
      },
      body: JSON.stringify({
        From: 'Movingto Funds <noreply@movingto.com>',
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
