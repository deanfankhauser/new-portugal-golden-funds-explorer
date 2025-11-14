import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupConfirmationRequest {
  email: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userId }: SignupConfirmationRequest = await req.json();
    
    console.log('[send-signup-confirmation] Sending confirmation for:', email);

    if (!email || !userId) {
      return new Response(
        JSON.stringify({ error: 'Email and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const postmarkToken = Deno.env.get('POSTMARK_SERVER_TOKEN');
    if (!postmarkToken) {
      console.error('POSTMARK_SERVER_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client to generate email confirmation link
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate email confirmation link using Supabase Admin API
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: email,
      options: {
        redirectTo: `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}.supabase.co/auth/v1/verify`
      }
    });

    if (linkError || !linkData) {
      console.error('Failed to generate confirmation link:', linkError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate confirmation link' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const confirmationUrl = `https://funds.movingto.com/email-confirmation?token_hash=${linkData.properties.hashed_token}&type=signup`;

    console.log('[send-signup-confirmation] Confirmation URL generated');

    // Send email via Postmark
    const emailResponse = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': postmarkToken,
      },
      body: JSON.stringify({
        From: 'noreply@movingto.com',
        To: email,
        Subject: 'Confirm Your Email - Movingto Funds',
        HtmlBody: generateConfirmationEmailHTML(email, confirmationUrl),
        TextBody: generateConfirmationEmailText(email, confirmationUrl),
        MessageStream: 'outbound'
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Postmark API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send confirmation email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await emailResponse.json();
    console.log('[send-signup-confirmation] Email sent successfully:', result.MessageID);

    return new Response(
      JSON.stringify({ success: true, messageId: result.MessageID }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[send-signup-confirmation] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

function generateConfirmationEmailHTML(email: string, confirmationUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #EDEAE6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #4B0F23 0%, #6B1533 100%); color: #FFFFFF; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
      <img src="https://funds.movingto.com/lovable-uploads/ab17d046-1cb9-44fd-aa6d-c4d338e11090.png" alt="Movingto Funds" style="max-width: 180px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
      <h1 style="margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -0.5px; color: #FFFFFF;">Confirm Your Email</h1>
    </div>
    
    <!-- Content -->
    <div style="background: #FFFFFF; padding: 40px 30px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hello,</p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Thank you for signing up for Movingto Funds! To complete your account setup, please confirm your email address.
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
        Click the button below to confirm your email address and start exploring investment opportunities.
      </p>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmationUrl}" style="background: #4B0F23; color: #FFFFFF; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(75, 15, 35, 0.2);">
          Confirm Email Address
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 24px 0 0 0; text-align: center;">
        Or copy and paste this link in your browser:<br/>
        <a href="${confirmationUrl}" style="color: #4B0F23; word-break: break-all;">${confirmationUrl}</a>
      </p>
      
      <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 16px 0 0 0; text-align: center;">
        <strong>Security Notice:</strong> This confirmation link will expire in 1 hour. 
        If you didn't create an account, please ignore this email.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background: #EDEAE6; padding: 30px; text-align: center; border-top: 2px solid #A97155;">
      <p style="margin: 0 0 10px 0; color: #4B0F23; font-size: 16px; font-weight: 600;">
        Movingto Funds
      </p>
      <p style="margin: 0 0 5px 0; color: #666666; font-size: 12px;">
        Moving To Global Pte Ltd
      </p>
      <p style="margin: 0 0 15px 0; color: #666666; font-size: 13px; line-height: 1.5;">
        160 Robinson Road, #14-04, Singapore Business Federation Center, Singapore, 068914
      </p>
      <p style="margin: 15px 0 0 0; color: #999999; font-size: 12px;">This email was sent to ${email}</p>
      <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
        <a href="https://funds.movingto.com" style="color: #A97155; text-decoration: none;">Visit our platform</a>
      </p>
    </div>
    
  </div>
</body>
</html>
  `;
}

function generateConfirmationEmailText(email: string, confirmationUrl: string): string {
  return `
Confirm Your Email - Movingto Funds

Hello,

Thank you for signing up for Movingto Funds! To complete your account setup, please confirm your email address.

Click this link to confirm your email address and start exploring investment opportunities:
${confirmationUrl}

Security Notice: This confirmation link will expire in 1 hour. If you didn't create an account, please ignore this email.

---

Movingto Funds
Moving To Global Pte Ltd
160 Robinson Road, #14-04, Singapore Business Federation Center, Singapore, 068914

This email was sent to ${email}
Visit our platform: https://funds.movingto.com
  `;
}

serve(handler);
