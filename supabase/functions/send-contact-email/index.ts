import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    // Validate inputs
    if (!name || !email || !subject || !message) {
      throw new Error("All fields are required");
    }

    if (name.length > 100 || email.length > 255 || subject.length > 200 || message.length > 2000) {
      throw new Error("Input exceeds maximum length");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Movingto Funds <noreply@movingto.com>",
      to: ["info@movingto.com"],
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 120px;"><strong>Name:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Email:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;"><a href="mailto:${email}" style="color: #0066cc;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Subject:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${subject}</td>
            </tr>
          </table>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="color: #333; white-space: pre-wrap; line-height: 1.6;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This message was sent via the contact form on funds.movingto.com
          </p>
        </div>
      `,
    });

    console.log("Admin notification sent:", adminEmailResponse);

    // Send confirmation to user
    const userEmailResponse = await resend.emails.send({
      from: "Movingto Funds <noreply@movingto.com>",
      to: [email],
      subject: "We received your message - Movingto Funds",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <img src="https://funds.movingto.com/lovable-uploads/9bdf45a5-6a2f-466e-8c2d-b8ba65863e8a.png" alt="Movingto Funds" style="height: 40px; margin-bottom: 20px;" />
          
          <h2 style="color: #333;">Thank you for contacting us, ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            We have received your message and will get back to you as soon as possible. 
            Our team typically responds within 1-2 business days.
          </p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your message:</h3>
            <p style="color: #666;"><strong>Subject:</strong> ${subject}</p>
            <p style="color: #666; white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            In the meantime, feel free to explore our platform to discover and compare 
            Portugal Golden Visa investment funds.
          </p>
          
          <a href="https://funds.movingto.com" style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
            Browse Funds
          </a>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            Moving To Global Pty Ltd<br>
            Bondi, Sydney, NSW 2026, Australia<br>
            <a href="https://funds.movingto.com" style="color: #0066cc;">funds.movingto.com</a>
          </p>
        </div>
      `,
    });

    console.log("User confirmation sent:", userEmailResponse);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
