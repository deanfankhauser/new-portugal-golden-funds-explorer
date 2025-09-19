import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    // Send email using Resend
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

    const emailResponse = await resend.emails.send({
      from: "MovingTo Funds <noreply@movingto.com>",
      to: [recipientEmail],
      subject: `Book Your Call - ${fundName} Discussion`,
      text: textContent,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="text-align: center; margin-bottom: 30px;">
<h1 style="color: #2563eb; margin: 0;">Book Your 15-Minute Call</h1>
</div>
<div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
<h2 style="color: #334155; margin-top: 0;">Thank you for your interest in ${fundName}</h2>
<p style="color: #64748b; line-height: 1.6;">We're excited to discuss this investment opportunity with you. Our team is ready to answer your questions and provide detailed insights about ${fundName}.</p>
</div>
<div style="margin: 30px 0;">
<h3 style="color: #334155;">What to expect in your call:</h3>
<ul style="color: #64748b; line-height: 1.8;">
<li>Detailed overview of ${fundName}</li>
<li>Investment strategy and risk assessment</li>
<li>Performance analysis and projections</li>
<li>Q&A session tailored to your needs</li>
</ul>
</div>
<div style="text-align: center; margin: 40px 0;">
<a href="https://movingto.com/contact?utm_source=funds-app&utm_medium=email&utm_campaign=booking-request&fund=${encodeURIComponent(fundName)}" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Schedule Your Call Now</a>
</div>
<div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
<p style="color: #94a3b8; font-size: 14px; text-align: center;">This email was sent because you requested a consultation for ${fundName}.<br>If you have any questions, please contact us at info@movingto.com</p>
</div>
</div>`,
    });

    console.log("📧 Booking request email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Booking request email sent successfully",
      emailId: emailResponse.data?.id 
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