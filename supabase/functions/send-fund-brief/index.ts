import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FundBriefRequest {
  userEmail: string;
  fundName: string;
  fundId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, fundName, fundId }: FundBriefRequest = await req.json();
    
    const gmailEmail = Deno.env.get("GMAIL_EMAIL");
    const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    if (!gmailEmail || !gmailAppPassword) {
      console.error("Gmail credentials not configured");
      return new Response(
        JSON.stringify({ 
          error: "Email service not configured" 
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log('Sending fund brief for:', fundName, 'to:', userEmail);

    // Get fund data to check for brief URL
    const { data: fundData, error: fundError } = await supabase
      .from('funds')
      .select('fund_brief_url')
      .eq('id', fundId)
      .single();

    if (fundError) {
      console.error('Error fetching fund data:', fundError);
      return new Response(
        JSON.stringify({ 
          error: "Fund not found" 
        }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!fundData.fund_brief_url) {
      console.error('No fund brief URL found for fund:', fundId);
      return new Response(
        JSON.stringify({ 
          error: "No fund brief available for this fund" 
        }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Extract filename from fund brief URL
    const fileName = fundData.fund_brief_url.split('/').pop();
    if (!fileName) {
      console.error('Invalid fund brief URL:', fundData.fund_brief_url);
      return new Response(
        JSON.stringify({ 
          error: "Invalid fund brief file" 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Download the fund brief PDF from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('fund-briefs')
      .download(fileName);

    if (downloadError || !fileData) {
      console.error('Error downloading fund brief:', downloadError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to retrieve fund brief file" 
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Convert blob to base64
    const arrayBuffer = await fileData.arrayBuffer();
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

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

    // Create fund brief email content
    const textContent = `
Fund Brief: ${fundName}

Dear Investor,

Please find attached the official fund brief for ${fundName}. This document contains comprehensive information about the fund including investment strategy, terms, performance data, and all regulatory disclosures.

If you have any questions about this fund or would like to schedule a consultation with our investment team, please don't hesitate to contact us.

View Online: https://funds.movingto.com/${fundId}

Best regards,
Investment Funds Platform Team
    `.trim();

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fund Brief Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
<h1 style="margin: 0; font-size: 24px;">Fund Brief: ${fundName}</h1>
<p style="margin: 10px 0 0 0; opacity: 0.9;">Comprehensive Investment Documentation</p>
</div>
<div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
<h2 style="color: #1e293b; margin-top: 0;">Dear Investor,</h2>
<div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3b82f6;">
<p style="margin: 0;"><strong>Please find attached the official fund brief for ${fundName}.</strong></p>
<p style="margin: 10px 0 0 0;">This comprehensive document contains all the essential information you need to make an informed investment decision, including fund strategy, terms, performance data, and regulatory disclosures.</p>
</div>
<div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center;">
<p style="margin: 0; color: #64748b; font-size: 14px;">📎 <strong>Fund Brief Document Attached</strong></p>
<p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">Official PDF document with complete fund information</p>
</div>
<div style="text-align: center; margin: 30px 0;">
<a href="https://funds.movingto.com/${fundId}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">View Fund Details</a>
</div>
<div style="text-align: center; padding: 20px 0; border-top: 1px solid #e2e8f0; margin-top: 30px;">
<p style="margin: 0; color: #64748b; font-size: 14px;">Best regards,<br><strong>Investment Funds Platform Team</strong></p>
</div>
</div>
</body>
</html>`;


    // Send the fund brief with the actual uploaded PDF attachment
    await client.send({
      from: `Investment Funds Platform <${gmailEmail}>`,
      to: userEmail,
      subject: `Fund Brief: ${fundName}`,
      html,
      content: textContent,
      attachments: [
        {
          filename: `${fundName.replace(/[^a-zA-Z0-9]/g, '_')}_Fund_Brief.pdf`,
          content: base64Data,
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    });

    console.log(`✅ Fund brief request email sent successfully to:`, userEmail);
    await client.close();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Fund brief request sent successfully",
        recipient: userEmail,
        fundName: fundName,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error sending fund brief email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to send fund brief request", 
        error: error?.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);