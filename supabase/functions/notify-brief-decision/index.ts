import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
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

interface BriefDecisionRequest {
  submissionId: string;
  fundName: string;
  fundId: string;
  decision: 'approved' | 'rejected';
  rejectionReason?: string;
  submitterEmail: string;
  submitterName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      submissionId, 
      fundName, 
      fundId, 
      decision, 
      rejectionReason, 
      submitterEmail, 
      submitterName 
    }: BriefDecisionRequest = await req.json();
    
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

    console.log(`Sending ${decision} notification for fund brief:`, fundName, 'to:', submitterEmail);

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

    // Create email content based on decision
    const isApproved = decision === 'approved';
    const subject = `Fund Brief ${isApproved ? 'Approved' : 'Rejected'}: ${fundName}`;
    
    const bodyContent = isApproved 
      ? `
        <h2 style="color: ${BRAND_COLORS.bordeaux}; margin-top: 0;">Dear ${submitterName},</h2>
        
        ${generateContentCard(`
          <p style="margin: 0;"><strong>🎉 Congratulations! Your fund brief has been approved and is now live on our platform.</strong></p>
          <p style="margin: 10px 0 0 0; color: ${BRAND_COLORS.textDark};">Users can now access and download the comprehensive fund documentation, helping them make informed investment decisions about ${fundName}.</p>
        `, 'bronze')}
        
        ${generateCTAButton('View Fund Page', `${COMPANY_INFO.website}/${fundId}`, 'bronze')}
      `
      : `
        <h2 style="color: ${BRAND_COLORS.bordeaux}; margin-top: 0;">Dear ${submitterName},</h2>
        
        ${generateContentCard(`
          <p style="margin: 0;"><strong>❌ Your fund brief submission has been rejected.</strong></p>
          ${rejectionReason ? `<p style="margin: 10px 0 0 0; color: ${BRAND_COLORS.textDark};"><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
          <p style="margin: 10px 0 0 0; color: ${BRAND_COLORS.textDark};">You may submit a new fund brief after addressing the feedback provided. Please ensure all documentation meets our platform standards before resubmission.</p>
        `, 'bordeaux')}
      `;

    const html = generateEmailWrapper(
      `Fund Brief ${isApproved ? 'Approved' : 'Rejected'}`,
      bodyContent,
      submitterEmail
    );

    // Plain text version
    const textContent = generatePlainTextEmail(
      `Fund Brief ${isApproved ? 'Approved' : 'Rejected'}`,
      isApproved 
        ? `Dear ${submitterName},

Great news! Your fund brief for ${fundName} has been approved and is now live on our platform. Users can now access and download the comprehensive fund documentation.

Thank you for using ${COMPANY_INFO.tradingName}.`
        : `Dear ${submitterName},

Unfortunately, your fund brief submission for ${fundName} has been rejected.

${rejectionReason ? `Reason: ${rejectionReason}` : ''}

You may submit a new fund brief after addressing the feedback provided.`,
      isApproved ? 'View Fund Page' : undefined,
      isApproved ? `${COMPANY_INFO.website}/${fundId}` : undefined
    );

    // Send the email
    await client.send({
      from: `${COMPANY_INFO.tradingName} <${gmailEmail}>`,
      to: submitterEmail,
      subject: subject,
      html,
      content: textContent,
    });

    console.log(`✅ ${decision} notification email sent successfully to:`, submitterEmail);
    await client.close();

    return new Response(
      JSON.stringify({
        success: true,
        message: `${decision} notification sent successfully`,
        recipient: submitterEmail,
        fundName: fundName,
        decision: decision
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error sending brief decision email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to send notification email", 
        error: error?.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
