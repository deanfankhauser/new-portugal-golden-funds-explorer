import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  redirectTo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectTo }: PasswordResetRequest = await req.json();

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
      defaultBase = 'https://funds.movingto.com';
    }
    // Keep the actual origin URL for development/preview environments
    // Don't redirect to develop.movingto.com as it may not be the correct app URL
    const normalize = (url?: string) => {
      if (!url) return `${defaultBase}/reset-password`;
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url.replace(/^\/+/, '')}`;
      }
      try {
        const u = new URL(url);
        return u.toString();
      } catch {
        return `${defaultBase}/reset-password`;
      }
    };
    const finalRedirect = normalize(redirectTo);

    console.log('Password reset redirect target:', finalRedirect);

    // Initialize Supabase client with environment-aware service role key
    const isDevOrigin =
      (finalRedirect && finalRedirect.includes('develop.movingto.com')) ||
      ((req.headers.get('origin') || '').includes('develop.movingto.com'));
    const supabaseUrl = Deno.env.get(isDevOrigin ? 'FUNDS_DEV_SUPABASE_URL' : 'SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get(isDevOrigin ? 'FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY' : 'SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate a secure reset token (for optional custom flows) and try to build a Supabase recovery link
    const resetToken = crypto.randomUUID();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    let recoveryLink: string | null = null;

    // Best-effort: store custom token if table exists (non-blocking)
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

    // Always try to generate a Supabase recovery link we can email
    try {
      console.log("Attempting to generate Supabase recovery link for:", email);
      console.log("Using Supabase URL:", supabaseUrl);
      console.log("Redirect URL:", finalRedirect);
      
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: {
          redirectTo: finalRedirect
        }
      });

      if (linkError) {
        console.error("Failed to generate Supabase recovery link:", {
          message: linkError.message,
          code: linkError.code,
          details: linkError
        });
        
        // If user not found, try to generate an invite link instead
        if (linkError.code === 'user_not_found') {
          console.log("User not found in Auth. Attempting to generate invite link...");
          
          const { data: inviteData, error: inviteError } = await supabase.auth.admin.generateLink({
            type: 'signup',
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
        // Varies by SDK version
        recoveryLink = (linkData as any)?.properties?.action_link ?? (linkData as any)?.action_link ?? null;
        console.log("Extracted recovery link:", recoveryLink ? "✅ Success" : "❌ Failed to extract");
        if (recoveryLink) {
          console.log("Recovery link preview:", recoveryLink.substring(0, 100) + "...");
        }
      }
    } catch (err) {
      console.error("Exception generating Supabase recovery link:", {
        message: err?.message,
        stack: err?.stack,
        error: err
      });
    }

    const gmailEmail = Deno.env.get("GMAIL_EMAIL") || "";
    const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD") || "";

    console.log("Gmail config check:", {
      hasEmail: !!gmailEmail,
      hasPassword: !!gmailAppPassword,
      hasRecoveryLink: !!recoveryLink,
      emailLength: gmailEmail.length,
      passwordLength: gmailAppPassword.length
    });

    if (!gmailEmail || !gmailAppPassword || !recoveryLink) {
      console.error("SMTP unavailable or recovery link missing. Falling back to Supabase-auth email.");
      console.error("Missing:", {
        gmail_email: !gmailEmail,
        gmail_password: !gmailAppPassword, 
        recovery_link: !recoveryLink
      });
      return await handleDirectSupabaseReset(email, finalRedirect, isDevOrigin);
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

    // Use Supabase recovery link (contains access and refresh tokens)
    const resetUrl = recoveryLink as string;

    const emailSubject = recoveryLink.includes('type=signup') 
      ? "🔐 Complete Your Account Setup - Investment Funds Platform"
      : "🔐 Password Reset Request - Investment Funds Platform";
      
    const isSignup = recoveryLink.includes('type=signup');
    const actionText = isSignup ? "Complete Account Setup" : "Reset My Password";
    const greeting = isSignup 
      ? "We received a request to set up your account for the Investment Funds Platform."
      : "We received a request to reset your password for your Investment Funds Platform account.";
    const instruction = isSignup
      ? "Click the button below to complete your account setup:"
    
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1f2937; margin: 0;">${isSignup ? 'Account Setup' : 'Password Reset Request'}</h1>
        </div>
        
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0 0 15px 0; font-size: 16px;">Hello,</p>
          <p style="margin: 0 0 15px 0;">${greeting}</p>
          <p style="margin: 0 0 20px 0;">${instruction}</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" 
               style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              ${actionText}
            </a>
          </div>
          
          <p style="margin: 15px 0 0 0; font-size: 14px; color: #6b7280;">
            Or copy and paste this link in your browser:<br>
            <a href="${resetUrl}" style="color: #3b82f6; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>Security Notice:</strong> This ${isSignup ? 'setup' : 'reset'} link will expire in 1 hour. If you didn't request this ${isSignup ? 'account setup' : 'reset'}, please ignore this email or contact support.
          </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #9ca3af;">
          <p>Investment Funds Platform<br>
          This email was sent to ${email}</p>
        </div>
      </div>
    `;

    console.log("=== SENDING PASSWORD RESET EMAIL via Gmail SMTP ===");
    console.log("To:", email);
    console.log("Reset URL:", resetUrl);

    try {
      console.log("Attempting to send email via Gmail SMTP...");
      
      await client.send({
        from: `Investment Funds Platform <${gmailEmail}>`,
        to: email,
        subject: emailSubject,
        html: emailBody,
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
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } catch (error) {
      console.error("Gmail SMTP Error Details:", {
        message: error?.message,
        code: error?.code,
        stack: error?.stack
      });
      await client.close();
      
      // Fallback to Supabase auth
      console.log("Falling back to Supabase built-in auth...");
      return await handleDirectSupabaseReset(email, finalRedirect, isDevOrigin);
    }
  } catch (error: any) {
    console.error("Error handling password reset request:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Password reset request failed", 
        error: error?.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

// Fallback function to use Supabase's built-in auth
async function handleDirectSupabaseReset(email: string, redirectTo?: string, isDev?: boolean) {
  const useDev = typeof isDev === 'boolean' ? isDev : (redirectTo?.includes('develop.movingto.com') ?? false);
  const supabaseUrl = Deno.env.get(useDev ? 'FUNDS_DEV_SUPABASE_URL' : 'SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get(useDev ? 'FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY' : 'SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(
    supabaseUrl,
    supabaseServiceKey
  );

  console.log("Using Supabase built-in password reset email for:", email);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo || 'https://funds.movingto.com/reset-password'
  });

  if (error) {
    console.error("Supabase auth error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Password reset failed",
        error: error.message
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "Password reset email triggered via Supabase",
      method: "supabase_resetPasswordForEmail"
    }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}

serve(handler);