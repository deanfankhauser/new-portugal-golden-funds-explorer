import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

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
    
    const textContent = `
Dear ${submitterName},

Your fund brief submission for ${fundName} has been ${decision}.

${isApproved 
  ? `Great news! Your fund brief has been approved and is now live on the platform. Users can now access and download the comprehensive fund documentation.

You can view the fund page at: https://funds.movingto.com/${fundId}

The fund brief is now available for potential investors to review and will help them make informed investment decisions.`
  : `Unfortunately, your fund brief submission has been rejected.

${rejectionReason ? `Reason for rejection: ${rejectionReason}` : ''}

You may submit a new fund brief after addressing the feedback provided. Please ensure all documentation meets our platform standards before resubmission.`
}

Thank you for using our Investment Funds Platform.

Best regards,
Investment Funds Platform Team
    `.trim();

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fund Brief ${decision}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="background: ${isApproved ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
<h1 style="margin: 0; font-size: 24px;">Fund Brief ${isApproved ? 'Approved' : 'Rejected'}</h1>
<p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">${fundName}</p>
</div>
<div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
<h2 style="color: #1e293b; margin-top: 0;">Dear ${submitterName},</h2>
<div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid ${isApproved ? '#10b981' : '#ef4444'};">
${isApproved 
  ? `<p style="margin: 0;"><strong>🎉 Congratulations! Your fund brief has been approved and is now live on our platform.</strong></p>
<p style="margin: 10px 0 0 0;">Users can now access and download the comprehensive fund documentation, helping them make informed investment decisions about ${fundName}.</p>`
  : `<p style="margin: 0;"><strong>❌ Your fund brief submission has been rejected.</strong></p>
${rejectionReason ? `<p style="margin: 10px 0 0 0;"><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
<p style="margin: 10px 0 0 0;">You may submit a new fund brief after addressing the feedback provided. Please ensure all documentation meets our platform standards before resubmission.</p>`
}
</div>
${isApproved 
  ? `<div style="text-align: center; margin: 30px 0;">
<a href="https://funds.movingto.com/${fundId}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">View Fund Page</a>
</div>`
  : ''
}
<div style="text-align: center; padding: 20px 0; border-top: 1px solid #e2e8f0; margin-top: 30px;">
<p style="margin: 0; color: #64748b; font-size: 14px;">Thank you for using our Investment Funds Platform<br><strong>Investment Funds Platform Team</strong></p>
</div>
</div>
</body>
</html>`;

    // Send the email
    await client.send({
      from: `Investment Funds Platform <${gmailEmail}>`,
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