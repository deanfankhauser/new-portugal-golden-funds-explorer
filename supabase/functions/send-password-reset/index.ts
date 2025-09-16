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

    console.log(`Processing password reset request for: ${email}`);

    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Generate a secure reset token
    const resetToken = crypto.randomUUID();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store reset token in database (you may need to create this table)
    try {
      const { error: tokenError } = await supabase
        .from('password_reset_tokens')
        .upsert({
          email: email,
          token: resetToken,
          expires_at: resetExpiry.toISOString(),
          used: false
        }, { onConflict: 'email' });

      if (tokenError) {
        console.log("Token storage error (table may not exist):", tokenError);
        // If table doesn't exist, we'll use a simpler approach with direct auth
        return await handleDirectSupabaseReset(email, redirectTo);
      }
    } catch (err) {
      console.log("Using fallback Supabase auth method");
      return await handleDirectSupabaseReset(email, redirectTo);
    }

    const gmailEmail = Deno.env.get("GMAIL_EMAIL") || "";
    const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD") || "";

    if (!gmailEmail || !gmailAppPassword) {
      console.error("Gmail credentials not configured. Falling back to Supabase auth.");
      return await handleDirectSupabaseReset(email, redirectTo);
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

    // Create reset URL
    const baseUrl = redirectTo || 'https://funds.movingto.com';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const emailSubject = "🔐 Password Reset Request - Investment Funds Platform";
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1f2937; margin: 0;">Password Reset Request</h1>
        </div>
        
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0 0 15px 0; font-size: 16px;">Hello,</p>
          <p style="margin: 0 0 15px 0;">We received a request to reset your password for your Investment Funds Platform account.</p>
          <p style="margin: 0 0 20px 0;">Click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" 
               style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Reset My Password
            </a>
          </div>
          
          <p style="margin: 15px 0 0 0; font-size: 14px; color: #6b7280;">
            Or copy and paste this link in your browser:<br>
            <a href="${resetUrl}" style="color: #3b82f6; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>Security Notice:</strong> This reset link will expire in 1 hour. If you didn't request this reset, please ignore this email or contact support.
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
          message: "Password reset email sent successfully",
          recipient: email,
          expiresIn: "1 hour"
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } catch (error) {
      console.error("Email sending failed:", String((error as any)?.message || error));
      await client.close();
      
      // Fallback to Supabase auth
      return await handleDirectSupabaseReset(email, redirectTo);
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
async function handleDirectSupabaseReset(email: string, redirectTo?: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  console.log("Using Supabase built-in password reset for:", email);

  const { error } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: email,
    options: {
      redirectTo: redirectTo || `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify`
    }
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
      message: "Password reset link generated (check Supabase auth logs)",
      method: "supabase_builtin"
    }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}

serve(handler);