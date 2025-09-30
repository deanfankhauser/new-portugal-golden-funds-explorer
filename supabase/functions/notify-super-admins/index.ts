import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  suggestionId: string;
  fundId: string;
  submitterName: string;
  submitterType: string;
  changes: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { suggestionId, fundId, submitterName, submitterType, changes }: NotificationRequest = await req.json();

    console.log(`Processing super admin notification for suggestion: ${suggestionId}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase configuration missing");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Supabase configuration missing",
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get super admin emails
    const { data: superAdmins, error: adminError } = await supabase
      .rpc('get_super_admin_emails');

    if (adminError) {
      console.error("Error fetching super admin emails:", adminError);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to fetch super admin emails",
          error: adminError.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!superAdmins || superAdmins.length === 0) {
      console.log("No super admins found to notify");
      return new Response(
        JSON.stringify({
          success: true,
          message: "No super admins to notify",
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Setup Gmail SMTP
    const gmailEmail = Deno.env.get("GMAIL_EMAIL") || "";
    const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD") || "";

    if (!gmailEmail || !gmailAppPassword) {
      console.error("Gmail credentials not configured");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Gmail credentials not configured",
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
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

    // Create email content
    const changedFields = Object.keys(changes);
    const emailSubject = `🔔 New Fund Edit Suggestion - ${fundId}`;
    
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Fund Edit Suggestion Received 📝</h2>
        <p>Dear Super Admin,</p>
        <p>A new fund edit suggestion has been submitted and requires your review.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Suggestion Details</h3>
          <p><strong>Suggestion ID:</strong> ${suggestionId}</p>
          <p><strong>Fund ID:</strong> ${fundId}</p>
          <p><strong>Submitted by:</strong> ${submitterName} (${submitterType})</p>
          <p><strong>Fields changed:</strong> ${changedFields.length} field(s)</p>
          <ul>
            ${changedFields.map(field => `<li>${field.replace(/_/g, ' ')}</li>`).join('')}
          </ul>
        </div>

        <div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <p style="margin: 0;"><strong>Action Required:</strong> Please log into the admin panel to review and approve/reject this suggestion.</p>
        </div>

        <p>You can review this suggestion in the admin panel under Fund Edit Suggestions.</p>
        <p>Best regards,<br>Movingto Team</p>
      </div>
    `;

    console.log(`Sending notifications to ${superAdmins.length} super admin(s)`);

    // Send emails to all super admins
    const emailPromises = superAdmins.map(async (admin: any) => {
      try {
        await client.send({
          from: `Movingto Team <${gmailEmail}>`,
          to: admin.email,
          subject: emailSubject,
          html: emailBody,
        });
        console.log(`✅ Email sent to super admin: ${admin.email}`);
        return { email: admin.email, success: true };
      } catch (error) {
        console.error(`❌ Failed to send email to ${admin.email}:`, error);
        return { email: admin.email, success: false, error: String(error) };
      }
    });

    const results = await Promise.all(emailPromises);
    await client.close();

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`Email notification summary: ${successCount} sent, ${failureCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Notifications sent to ${successCount} super admin(s)`,
        totalAdmins: superAdmins.length,
        successCount,
        failureCount,
        results,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in notify-super-admins function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to process notification request", 
        error: error?.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);