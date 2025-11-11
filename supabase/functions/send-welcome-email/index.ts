import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { 
  generateEmailWrapper, 
  generateContentCard, 
  generateCTAButton,
  generatePlainTextEmail 
} from "../_shared/email-templates.ts";

interface WelcomeEmailData {
  userEmail: string;
  loginUrl: string;
}

function generateWelcomeEmailHTML({ userEmail, loginUrl }: WelcomeEmailData): string {
  const contentCard = generateContentCard(`
    <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0;">Hello and welcome to Movingto Funds!</p>
    <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0;">Your account has been successfully created. You now have access to our comprehensive database of investment funds, detailed analysis tools, and comparison features.</p>
    <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0;"><strong>What you can do:</strong></p>
    <ul style="color: #374151; font-size: 16px; line-height: 1.5; margin: 16px 0; padding-left: 20px;">
      <li>Browse and search our extensive fund database</li>
      <li>Compare funds side-by-side</li>
      <li>Save funds to your personal shortlist</li>
      <li>Access detailed performance analytics</li>
      <li>Get personalized fund recommendations</li>
    </ul>
    ${generateCTAButton('Get Started', loginUrl, 'bordeaux')}
    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 24px 0 0 0; text-align: center;">
      If you have any questions or need assistance, please don't hesitate to contact our support team.
    </p>
  `, 'bordeaux');

  return generateEmailWrapper('Welcome to Movingto Funds!', contentCard, userEmail);
}

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

    // Generate HTML email template
    const html = generateWelcomeEmailHTML({
      userEmail: email,
      loginUrl: finalLoginUrl,
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
      'Welcome to Movingto Funds!',
      'Your account has been successfully created. You now have access to our comprehensive database of investment funds, detailed analysis tools, and comparison features. Browse and search funds, compare side-by-side, save to your shortlist, access performance analytics, and get personalized recommendations.',
      'Get Started',
      finalLoginUrl
    );

    // Send the welcome email
    await client.send({
      from: `Movingto Funds <${gmailEmail}>`,
      to: email,
      subject: "Welcome to Movingto Funds! 🎉",
      html,
      plainText,
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