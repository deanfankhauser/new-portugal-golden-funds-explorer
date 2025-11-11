import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
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

    // Generate a secure reset token
    const resetToken = crypto.randomUUID();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    let recoveryLink: string | null = null;

    // Best-effort: store custom token if table exists
    try {
      const { error: tokenError } = await supabase
        .from('password_reset_tokens')
        .upsert(
          {
            email: email,
            token: resetToken,
            expires_at: resetExpiry.toISOString(),
            used: false
          },
          { onConflict: 'email' }
        );

      if (tokenError) {
        console.log("Token storage error (table may not exist):", tokenError);
      }
    } catch (err) {
      console.log("Token storage skipped (table not available). Proceeding without custom token.");
    }

    // Generate Supabase recovery link
    try {
      console.log("Attempting to generate Supabase recovery link for:", email);
      
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: {
          redirectTo: finalRedirect
        }
      });

      if (linkError) {
        console.error("Failed to generate Supabase recovery link:", linkError);
        
        // If user not found, try invite link
        if (linkError.code === 'user_not_found') {
          console.log("User not found in Auth. Attempting to generate invite link...");
          
          const { data: inviteData, error: inviteError } = await supabase.auth.admin.generateLink({
            type: 'invite',
            email,
            options: {
              redirectTo: finalRedirect
            }
          });
          
          if (inviteError) {
            console.error("Failed to generate invite link:", inviteError);
          } else {
            console.log("Generated invite link successfully");
            recoveryLink = (inviteData as any)?.properties?.action_link ?? (inviteData as any)?.action_link ?? null;
          }
        }
      } else {
        console.log("Raw link data received:", linkData);
        recoveryLink = (linkData as any)?.properties?.action_link ?? (linkData as any)?.action_link ?? null;
        console.log("Extracted recovery link:", recoveryLink ? "✅ Success" : "❌ Failed to extract");
      }
    } catch (err: unknown) {
      console.error("Exception generating Supabase recovery link:", err);
    }

    const gmailEmail = Deno.env.get("GMAIL_EMAIL") || "";
    const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD") || "";

    if (!gmailEmail || !gmailAppPassword || !recoveryLink) {
      console.error("SMTP unavailable or recovery link missing. Falling back to Supabase-auth email.");
      return await handleDirectSupabaseReset(email, finalRedirect);
    }

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

    const resetUrl = recoveryLink as string;
    const isSignup = recoveryLink.includes('type=invite');
    const actionText = isSignup ? "Create Your Account" : "Reset My Password";
    const headingText = isSignup ? "Account Setup" : "Password Reset Request";
    const greetingText = isSignup 
      ? `You requested a password reset, but no account exists with this email address. To get started with ${COMPANY_INFO.tradingName}, you need to create an account first.`
      : `We received a request to reset your password for your ${COMPANY_INFO.tradingName} account.`;
    const instructionText = isSignup
      ? "Click the button below to create your account and get started:"
      : "Click the button below to reset your password:";

    // Branded HTML email
    const bodyContent = `
      <p style="margin: 0 0 20px; color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6;">
        Hello,
      </p>
      
      <p style="margin: 0 0 30px; color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6;">
        ${greetingText}
      </p>
      
      ${generateContentCard(`
        <p style="margin: 0 0 15px; color: ${BRAND_COLORS.textDark};">${instructionText}</p>
        ${generateCTAButton(actionText, resetUrl, 'bordeaux')}
        <p style="margin: 15px 0 0 0; font-size: 14px; color: ${BRAND_COLORS.textMuted}; line-height: 1.4;">
          Or copy and paste this link in your browser:<br>
          <a href="${resetUrl}" style="color: ${BRAND_COLORS.bronze}; word-break: break-all; font-size: 12px;">${resetUrl}</a>
        </p>
      `, 'bordeaux')}
      
      ${generateContentCard(`
        <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.bordeaux}; line-height: 1.4;">
          <strong>Security Notice:</strong> This ${isSignup ? 'account setup' : 'reset'} link will expire in 1 hour. If you did not request this ${isSignup ? 'account setup' : 'reset'}, please ignore this email or contact support.
        </p>
      `, 'bronze')}
    `;

    const htmlBody = generateEmailWrapper(headingText, bodyContent, email);

    // Plain text version
    const textBody = generatePlainTextEmail(
      headingText,
      `Hello,

${greetingText}

${instructionText}

If you have any questions or need assistance, please don't hesitate to reach out to our support team.

Security Notice: This link will expire in 1 hour. If you did not request this, please ignore this email.

This email was sent to ${email}`,
      actionText,
      resetUrl
    );

    console.log("=== SENDING PASSWORD RESET EMAIL via Gmail SMTP ===");

    try {
      await client.send({
        from: `${COMPANY_INFO.tradingName} <${gmailEmail}>`,
        to: email,
        subject: isSignup ? `Complete Your Account Setup - ${COMPANY_INFO.tradingName}` : `Password Reset Request - ${COMPANY_INFO.tradingName}`,
        html: htmlBody,
        content: textBody,
      });

      console.log("✅ Password reset email sent successfully via Gmail SMTP");
      await client.close();
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Password reset email sent successfully via Gmail",
          recipient: email,
          expiresIn: "1 hour"
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error: unknown) {
      console.error("Gmail SMTP Error Details:", error);
      await client.close();
      
      console.log("Falling back to Supabase built-in auth...");
      return await handleDirectSupabaseReset(email, finalRedirect);
    }
  } catch (error: any) {
    console.error("Error handling password reset request:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Password reset request failed", 
        error: error?.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

// Fallback function to use Supabase's built-in auth
async function handleDirectSupabaseReset(email: string, redirectTo?: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log("Using Supabase built-in password reset email for:", email);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo || `${COMPANY_INFO.website}/reset-password`
  });

  if (error) {
    console.error("Supabase auth error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Password reset failed",
        error: error.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "Password reset email triggered via Supabase",
      method: "supabase_resetPasswordForEmail"
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

serve(withSecurity(handler));
