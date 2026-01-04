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

    // Create branded email content
    const bodyContent = `
      <h2 style="color: ${BRAND_COLORS.bordeaux}; margin-top: 0;">Dear Investor,</h2>
      
      ${generateContentCard(`
        <p style="margin: 0;"><strong>Please find attached the official fund brief for ${fundName}.</strong></p>
        <p style="margin: 10px 0 0 0; color: ${BRAND_COLORS.textDark};">This comprehensive document contains all the essential information you need to make an informed investment decision, including fund strategy, terms, performance data, and regulatory disclosures.</p>
      `, 'bordeaux')}
      
      <div style="background: ${BRAND_COLORS.bone}; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; color: ${BRAND_COLORS.bordeaux}; font-size: 14px;">📎 <strong>Fund Brief Document Attached</strong></p>
        <p style="margin: 5px 0 0 0; color: ${BRAND_COLORS.textMuted}; font-size: 12px;">Official PDF document with complete fund information</p>
      </div>
      
      ${generateCTAButton('View Fund Details', `${COMPANY_INFO.website}/${fundId}`, 'bronze')}
      
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px; line-height: 1.6;">
        If you have any questions about this fund or would like to schedule a consultation with our investment team, please don't hesitate to contact us.
      </p>
    `;

    const html = generateEmailWrapper(
      `Fund Brief: ${fundName}`,
      bodyContent,
      userEmail
    );

    // Plain text version
    const textContent = generatePlainTextEmail(
      `Fund Brief: ${fundName}`,
      `Dear Investor,

Please find attached the official fund brief for ${fundName}. This document contains comprehensive information about the fund including investment strategy, terms, performance data, and all regulatory disclosures.

If you have any questions about this fund or would like to schedule a consultation with our investment team, please don't hesitate to contact us.`,
      'View Fund Details',
      `${COMPANY_INFO.website}/${fundId}`
    );

    // Send the fund brief with the actual uploaded PDF attachment
    await client.send({
      from: `${COMPANY_INFO.tradingName} <${gmailEmail}>`,
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
