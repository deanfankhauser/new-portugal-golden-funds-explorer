import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { 
  generateEmailHeader, 
  generateEmailFooter, 
  generateCTAButton, 
  BRAND_COLORS 
} from '../_shared/email-templates.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const POSTMARK_API_URL = 'https://api.postmarkapp.com/email';
const DEAN_EMAIL = 'dean@movingto.com';

interface StatusChangeData {
  enquiryId: string;
  oldStatus: string;
  newStatus: string;
  fundId: string;
  fundName: string;
  changedBy: string;
  changedAt: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  investmentRange: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const postmarkApiKey = Deno.env.get('POSTMARK_SERVER_TOKEN') || Deno.env.get('POSTMARK_API_KEY');
    
    if (!postmarkApiKey) {
      console.error('POSTMARK_SERVER_TOKEN not found');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const statusChangeData: StatusChangeData = await req.json();
    
    console.log('Sending status change notification:', statusChangeData);
    
    // Generate email content
    const email = generateStatusChangeEmail(statusChangeData);
    
    // Send email to Dean
    const response = await fetch(POSTMARK_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': postmarkApiKey,
      },
      body: JSON.stringify({
        From: 'noreply@movingto.com',
        To: DEAN_EMAIL,
        Subject: `Lead Status Updated: ${statusChangeData.leadName} - ${statusChangeData.fundName}`,
        HtmlBody: email.html,
        TextBody: email.text,
        MessageStream: 'outbound',
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Postmark API error:', errorText);
      throw new Error(`Postmark API error: ${response.status}`);
    }
    
    console.log('Status change notification sent successfully');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Status change notification sent' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error sending status change notification:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateStatusChangeEmail(data: StatusChangeData) {
  const statusColors: Record<string, string> = {
    'open': BRAND_COLORS.bronze,
    'won': '#10B981',
    'closed_lost': '#EF4444'
  };
  
  const oldStatusColor = statusColors[data.oldStatus] || BRAND_COLORS.textMuted;
  const newStatusColor = statusColors[data.newStatus] || BRAND_COLORS.textMuted;
  
  const html = `
    ${generateEmailHeader()}
    
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: ${BRAND_COLORS.bordeaux}; margin-top: 0;">Lead Status Updated</h1>
      
      <div style="background: ${BRAND_COLORS.bone}; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${BRAND_COLORS.bronze};">
        <p style="margin: 0 0 10px 0; color: ${BRAND_COLORS.textDark}; font-size: 16px; font-weight: 600;">Status Change Alert</p>
        <p style="margin: 0; color: ${BRAND_COLORS.textMuted};">A fund manager has updated the status of a lead.</p>
      </div>
      
      <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid ${BRAND_COLORS.bone};">
        <h2 style="margin-top: 0; color: ${BRAND_COLORS.bordeaux}; font-size: 18px;">Status Update Details</h2>
        
        <div style="background: ${BRAND_COLORS.bone}; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <div style="text-align: center;">
            <span style="display: inline-block; padding: 8px 16px; background: ${oldStatusColor}20; color: ${oldStatusColor}; border-radius: 20px; font-weight: 600; margin: 0 10px;">${data.oldStatus.toUpperCase()}</span>
            <span style="color: ${BRAND_COLORS.textMuted};">→</span>
            <span style="display: inline-block; padding: 8px 16px; background: ${newStatusColor}20; color: ${newStatusColor}; border-radius: 20px; font-weight: 600; margin: 0 10px;">${data.newStatus.toUpperCase()}</span>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600; width: 35%;">Lead Name:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark};">${data.leadName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Lead Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${data.leadEmail}" style="color: ${BRAND_COLORS.bronze};">${data.leadEmail}</a></td>
          </tr>
          ${data.leadPhone ? `<tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Lead Phone:</td>
            <td style="padding: 8px 0;"><a href="tel:${data.leadPhone}" style="color: ${BRAND_COLORS.bronze};">${data.leadPhone}</a></td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Fund:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark};">${data.fundName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Investment Range:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark};">${data.investmentRange}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Changed By:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark};">${data.changedBy}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Changed At:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark};">${new Date(data.changedAt).toLocaleString('en-US', { 
              dateStyle: 'medium', 
              timeStyle: 'short' 
            })}</td>
          </tr>
        </table>
      </div>
      
      ${generateCTAButton('View in Dashboard', `https://funds.movingto.com/manage-fund/${data.fundId}?tab=leads`, 'bordeaux')}
    </div>
    
    ${generateEmailFooter()}
  `;
  
  const text = `
Lead Status Updated

Status Change Alert
A fund manager has updated the status of a lead.

Status Update Details:
${data.oldStatus.toUpperCase()} → ${data.newStatus.toUpperCase()}

Lead Information:
- Lead Name: ${data.leadName}
- Lead Email: ${data.leadEmail}
${data.leadPhone ? `- Lead Phone: ${data.leadPhone}` : ''}
- Fund: ${data.fundName}
- Investment Range: ${data.investmentRange}
- Changed By: ${data.changedBy}
- Changed At: ${new Date(data.changedAt).toLocaleString('en-US', { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  })}

View in Dashboard: https://funds.movingto.com/manage-fund/${data.fundId}?tab=leads

---
Moving To Global Pty Ltd
Melbourne, Victoria, Australia
  `;
  
  return { html, text };
}
