import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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

    // Send email using Gmail SMTP
    const textContent = `Book Your 15-Minute Call - ${fundName} Discussion

Thank you for your interest in ${fundName}

We're excited to discuss this investment opportunity with you. Our team is ready to answer your questions and provide detailed insights about ${fundName}.

What to expect in your call:
- Detailed overview of ${fundName}
- Investment strategy and risk assessment
- Performance analysis and projections
- Q&A session tailored to your needs

Schedule Your Call Now: https://movingto.com/contact?utm_source=funds-app&utm_medium=email&utm_campaign=booking-request&fund=${encodeURIComponent(fundName)}

This email was sent because you requested a consultation for ${fundName}.
If you have any questions, please contact us at info@movingto.com`;

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Book Your Call</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
<h1 style="margin: 0; font-size: 24px;">Book Your 15-Minute Call</h1>
<p style="margin: 10px 0 0 0; opacity: 0.9;">${fundName} Discussion</p>
</div>
<div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
<h2 style="color: #1e293b; margin-top: 0;">Thank you for your interest in ${fundName}</h2>
<div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2563eb;">
<p style="margin: 0;">We're excited to discuss this investment opportunity with you. Our team is ready to answer your questions and provide detailed insights about ${fundName}.</p>
</div>
<div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
<h3 style="margin-top: 0; color: #1e293b;">What to expect in your call:</h3>
<ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
<li>Detailed overview of ${fundName}</li>
<li>Investment strategy and risk assessment</li>
<li>Performance analysis and projections</li>
<li>Q&A session tailored to your needs</li>
</ul>
</div>
<div style="text-align: center; margin: 30px 0;">
<a href="https://movingto.com/contact?utm_source=funds-app&utm_medium=email&utm_campaign=booking-request&fund=${encodeURIComponent(fundName)}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">Schedule Your Call Now</a>
</div>
<div style="text-align: center; padding: 20px 0; border-top: 1px solid #e2e8f0; margin-top: 30px;">
<p style="margin: 0; color: #64748b; font-size: 14px;">This email was sent because you requested a consultation for ${fundName}.<br>If you have any questions, please contact us at info@movingto.com</p>
</div>
</div>
</body>
</html>`;

    // Send the booking request email
    await client.send({
      from: `Investment Funds Platform <${gmailEmail}>`,
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