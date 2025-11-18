import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { withSecurity, validateEmail, sanitizeString } from '../_shared/security.ts';
import { 
  BRAND_COLORS, 
  COMPANY_INFO, 
  generateEmailWrapper, 
  generateCTAButton, 
  generateContentCard,
  generatePlainTextEmail 
} from "../_shared/email-templates.ts";

interface PasswordResetRequest {
  email: string;
  redirectTo?: string;
}

const POSTMARK_API_URL = 'https://api.postmarkapp.com/email';

const handler = async (req: Request): Promise<Response> => {
  try {
    const { email, redirectTo }: PasswordResetRequest = await req.json();
    
    // Validate email
    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const safeRedirectTo = redirectTo ? sanitizeString(redirectTo, 500) : undefined;
    console.log('Password reset request received:', { email, redirectTo: safeRedirectTo });

    // Determine a safe redirect target
    const reqOrigin = req.headers.get('origin') || req.headers.get('referer') || '';
    let defaultBase = '';
    try {
      if (reqOrigin) {
        const u = new URL(reqOrigin);
        defaultBase = u.origin;
      }
    } catch {
      defaultBase = reqOrigin && reqOrigin.startsWith('http') ? new URL(reqOrigin).origin : '';
    }
    if (!defaultBase) {
      defaultBase = COMPANY_INFO.website;
    }
    
    const normalize = (url?: string) => {
      if (!url) return `${defaultBase}/reset-password`;
      
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url.replace(/^\/+/, '')}`;
      }
      
      try {
        const u = new URL(url);
        if (u.pathname === '/' || u.pathname === '') {
          u.pathname = '/reset-password';
        } else if (!u.pathname.includes('reset-password')) {
          u.pathname = u.pathname.replace(/\/$/, '') + '/reset-password';
        }
        console.log(`Normalized URL: ${url} -> ${u.toString()}`);
        return u.toString();
      } catch (err) {
        console.error(`Failed to normalize URL: ${url}`, err);
        return `${defaultBase}/reset-password`;
      }
    };
    const finalRedirect = normalize(safeRedirectTo);

    console.log('Password reset redirect target:', finalRedirect);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    console.log('Using Supabase URL from env:', supabaseUrl);
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate Supabase recovery link
    let recoveryLink: string | null = null;
    
    try {
      console.log("Generating Supabase recovery link for:", email);
      
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: {
          redirectTo: finalRedirect
        }
      });

      if (linkError) {
        console.error('Error generating recovery link:', linkError);
        throw new Error(`Failed to generate recovery link: ${linkError.message}`);
      }

      if (!linkData?.properties?.action_link) {
        console.error('No action_link returned:', linkData);
        throw new Error('Recovery link generation failed - no action_link returned');
      }

      recoveryLink = linkData.properties.action_link;
      console.log('✅ Recovery link generated successfully');

    } catch (linkGenError) {
      console.error('Recovery link generation failed:', linkGenError);
      throw linkGenError;
    }

    // Send email via Postmark
    const postmarkToken = Deno.env.get('POSTMARK_SERVER_TOKEN') || Deno.env.get('POSTMARK_API_KEY');
    
    if (!postmarkToken) {
      console.error('❌ POSTMARK_SERVER_TOKEN not configured');
      throw new Error('Email service not configured');
    }

    console.log('=== SENDING PASSWORD RESET EMAIL via Postmark ===');

    // Generate branded email content
    const emailContent = `
      <p style="margin: 0 0 16px 0; color: #4B0F23; font-size: 16px; line-height: 24px;">
        We received a request to reset your password for your Movingto Funds account.
      </p>
      
      ${generateContentCard(`
        <p style="margin: 0 0 12px 0; color: #4B0F23; font-size: 15px; line-height: 22px;">
          Click the button below to create a new password:
        </p>
        ${generateCTAButton('Reset Your Password', recoveryLink, 'bordeaux')}
        <p style="margin: 12px 0 0 0; color: #84626d; font-size: 14px; line-height: 20px;">
          This link will expire in <strong>1 hour</strong> for security reasons.
        </p>
      `, 'bordeaux')}
      
      ${generateContentCard(`
        <p style="margin: 0 0 8px 0; color: #4B0F23; font-size: 14px; line-height: 20px; font-weight: 600;">
          Security Notice:
        </p>
        <p style="margin: 0 0 8px 0; color: #4B0F23; font-size: 14px; line-height: 20px;">
          • If you didn't request this password reset, please ignore this email
        </p>
        <p style="margin: 0 0 8px 0; color: #4B0F23; font-size: 14px; line-height: 20px;">
          • Your password will remain unchanged until you create a new one
        </p>
        <p style="margin: 0; color: #4B0F23; font-size: 14px; line-height: 20px;">
          • Never share this link with anyone
        </p>
      `)}
      
      <p style="margin: 24px 0 0 0; color: #84626d; font-size: 14px; line-height: 20px;">
        If you're having trouble clicking the button, copy and paste this URL into your browser:
      </p>
      <p style="margin: 8px 0 0 0; color: #A97155; font-size: 13px; line-height: 18px; word-break: break-all;">
        ${recoveryLink}
      </p>
    `;

    const htmlBody = generateEmailWrapper(
      'Reset Your Password',
      emailContent,
      email
    );

    const textBody = generatePlainTextEmail(
      'Reset Your Password',
      `We received a request to reset your password for your Movingto Funds account.

Click the link below to create a new password:
${recoveryLink}

This link will expire in 1 hour for security reasons.

SECURITY NOTICE:
• If you didn't request this password reset, please ignore this email
• Your password will remain unchanged until you create a new one
• Never share this link with anyone

If you're having trouble, copy and paste this URL into your browser:
${recoveryLink}`,
      'Reset Your Password',
      recoveryLink
    );

    try {
      const postmarkResponse = await fetch(POSTMARK_API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': postmarkToken,
        },
        body: JSON.stringify({
          From: 'Movingto Funds <noreply@movingto.com>',
          To: email,
          Subject: 'Reset Your Password - Movingto Funds',
          HtmlBody: htmlBody,
          TextBody: textBody,
          MessageStream: 'outbound',
          TrackOpens: true,
          TrackLinks: 'HtmlAndText'
        })
      });

      if (!postmarkResponse.ok) {
        const errorText = await postmarkResponse.text();
        console.error('Postmark API error:', errorText);
        throw new Error(`Postmark API error: ${postmarkResponse.status} - ${errorText}`);
      }

      const postmarkResult = await postmarkResponse.json();
      console.log('✅ Password reset email sent successfully via Postmark:', postmarkResult);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Password reset email sent successfully",
          messageId: postmarkResult.MessageID
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json" } 
        }
      );

    } catch (emailError) {
      console.error('Failed to send email via Postmark:', emailError);
      throw new Error(`Failed to send password reset email: ${emailError.message}`);
    }

  } catch (error: any) {
    console.error('Password reset handler error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send password reset email" 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
};

serve(withSecurity(handler));
