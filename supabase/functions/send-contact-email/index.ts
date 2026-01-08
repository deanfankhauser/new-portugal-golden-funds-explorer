import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const POSTMARK_API_URL = "https://api.postmarkapp.com/email";
const POSTMARK_SERVER_TOKEN = Deno.env.get("POSTMARK_SERVER_TOKEN");

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

// Initialize Supabase client with service role for database operations
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sendEmail = async (emailData: {
  From: string;
  To: string;
  ReplyTo?: string;
  Subject: string;
  HtmlBody: string;
}) => {
  const response = await fetch(POSTMARK_API_URL, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": POSTMARK_SERVER_TOKEN!,
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Postmark API error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

const handler = async (req: Request): Promise<Response> => {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Get request metadata for tracking
    const userAgent = req.headers.get("user-agent");
    const referrer = req.headers.get("referer");

    // Save submission to database FIRST (before sending emails)
    let submissionId: string | null = null;
    try {
      const { data: submission, error: dbError } = await supabase
        .from("contact_submissions")
        .insert({
          name,
          email,
          subject,
          message,
          user_agent: userAgent,
          referrer: referrer,
        })
        .select("id")
        .single();

      if (dbError) {
        console.error("Failed to save submission to database:", dbError);
      } else {
        submissionId = submission.id;
        console.log("Submission saved to database:", submissionId);
      }
    } catch (dbErr) {
      console.error("Database error (non-fatal):", dbErr);
      // Continue anyway - email delivery is still priority
    }

    // Sanitize message for HTML
    const sanitizedMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const sanitizedName = name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const sanitizedSubject = subject.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Send notification to admin
    const adminEmailResponse = await sendEmail({
      From: "noreply@movingto.com",
      To: "info@movingto.com",
      ReplyTo: email,
      Subject: `[Contact Form] ${subject}`,
      HtmlBody: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 120px;"><strong>Name:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${sanitizedName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Email:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;"><a href="mailto:${email}" style="color: #0066cc;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Subject:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${sanitizedSubject}</td>
            </tr>
          </table>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="color: #333; white-space: pre-wrap; line-height: 1.6;">${sanitizedMessage}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This message was sent via the contact form on funds.movingto.com
          </p>
        </div>
      `,
    });

    console.log("Admin notification sent:", adminEmailResponse);

    // Update database with admin email status
    if (submissionId) {
      try {
        await supabase
          .from("contact_submissions")
          .update({
            admin_email_sent: true,
            admin_email_sent_at: new Date().toISOString(),
            postmark_message_id: adminEmailResponse?.MessageID || null,
          })
          .eq("id", submissionId);
      } catch (updateErr) {
        console.error("Failed to update admin email status:", updateErr);
      }
    }

    // Send confirmation to user (non-critical - don't fail if this errors)
    let userEmailSent = false;
    try {
      const userEmailResponse = await sendEmail({
        From: "noreply@movingto.com",
        To: email,
        Subject: "We received your message - Movingto Funds",
        HtmlBody: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <img src="https://funds.movingto.com/lovable-uploads/9bdf45a5-6a2f-466e-8c2d-b8ba65863e8a.png" alt="Movingto Funds" style="height: 40px; margin-bottom: 20px;" />
            
            <h2 style="color: #333;">Thank you for contacting us, ${sanitizedName}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              We have received your message and will get back to you as soon as possible. 
              Our team typically responds within 1-2 business days.
            </p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your message:</h3>
              <p style="color: #666;"><strong>Subject:</strong> ${sanitizedSubject}</p>
              <p style="color: #666; white-space: pre-wrap;">${sanitizedMessage}</p>
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
      userEmailSent = true;
    } catch (userEmailError: any) {
      // Log but don't fail - admin already received the message
      console.warn("Could not send user confirmation email (recipient may be inactive):", userEmailError.message);
    }

    // Update database with user email status
    if (submissionId) {
      try {
        await supabase
          .from("contact_submissions")
          .update({
            user_email_sent: userEmailSent,
            user_email_sent_at: userEmailSent ? new Date().toISOString() : null,
          })
          .eq("id", submissionId);
      } catch (updateErr) {
        console.error("Failed to update user email status:", updateErr);
      }
    }

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
    
    // Try to log the error to database if we have a submission ID
    // Note: We can't access submissionId here since it's in the try block scope
    // But at least the submission was saved before the error occurred
    
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
