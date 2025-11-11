import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { 
  BRAND_COLORS, 
  COMPANY_INFO, 
  generateEmailWrapper, 
  generateCTAButton, 
  generateContentCard,
  generatePlainTextEmail 
} from "../_shared/email-templates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingRequestData {
  fundName: string;
  userEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fundName, userEmail }: BookingRequestData = await req.json();

    // Create Supabase client for this request
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header if not provided
    let recipientEmail = userEmail;
    if (!recipientEmail) {
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (user) {
          recipientEmail = user.email;
        }
      }
    }

    if (!recipientEmail) {
      return new Response(JSON.stringify({ error: "User email not found" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`📅 Sending booking request email for fund: ${fundName} to: ${recipientEmail}`);

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

    // Create branded email content
    const bodyContent = `
      <h2 style="color: ${BRAND_COLORS.bordeaux}; margin-top: 0;">Thank you for your interest in ${fundName}</h2>
      
      ${generateContentCard(`
        <p style="margin: 0; color: ${BRAND_COLORS.textDark};">We're excited to discuss this investment opportunity with you. Our team is ready to answer your questions and provide detailed insights about ${fundName}.</p>
      `, 'bronze')}
      
      <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: ${BRAND_COLORS.bordeaux};">What to expect in your call:</h3>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8; color: ${BRAND_COLORS.textDark};">
          <li>Detailed overview of ${fundName}</li>
          <li>Investment strategy and risk assessment</li>
          <li>Performance analysis and projections</li>
          <li>Q&A session tailored to your needs</li>
        </ul>
      </div>
      
      ${generateCTAButton('Schedule Your Call Now', `https://movingto.com/contact?utm_source=funds-app&utm_medium=email&utm_campaign=booking-request&fund=${encodeURIComponent(fundName)}`, 'bordeaux')}
      
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px; line-height: 1.6;">
        This email was sent because you requested a consultation for ${fundName}.<br>
        If you have any questions, please contact us at info@movingto.com
      </p>
    `;

    const html = generateEmailWrapper(
      `Book Your 15-Minute Call - ${fundName} Discussion`,
      bodyContent,
      recipientEmail
    );

    // Plain text version
    const textContent = generatePlainTextEmail(
      `Book Your 15-Minute Call - ${fundName} Discussion`,
      `Thank you for your interest in ${fundName}

We're excited to discuss this investment opportunity with you. Our team is ready to answer your questions and provide detailed insights about ${fundName}.

What to expect in your call:
- Detailed overview of ${fundName}
- Investment strategy and risk assessment
- Performance analysis and projections
- Q&A session tailored to your needs

This email was sent because you requested a consultation for ${fundName}.
If you have any questions, please contact us at info@movingto.com`,
      'Schedule Your Call Now',
      `https://movingto.com/contact?utm_source=funds-app&utm_medium=email&utm_campaign=booking-request&fund=${encodeURIComponent(fundName)}`
    );

    // Send the booking request email
    await client.send({
      from: `${COMPANY_INFO.tradingName} <${gmailEmail}>`,
      to: recipientEmail,
      subject: `Book Your Call - ${fundName} Discussion`,
      html,
      content: textContent,
    });

    console.log(`✅ Booking request email sent successfully to:`, recipientEmail);
    await client.close();

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Booking request email sent successfully",
      recipient: recipientEmail,
      fundName: fundName,
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("❌ Error in send-booking-request function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send booking request email",
        details: error.stack 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
