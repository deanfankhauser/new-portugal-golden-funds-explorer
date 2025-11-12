import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import {
  generateEmailHeader,
  generateEmailFooter,
  generateCTAButton,
  generateContentCard,
  generateEmailWrapper,
  BRAND_COLORS,
} from "../_shared/email-templates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadStatusCheckRequest {
  leadId: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  fundId: string;
  fundName: string;
  managerName: string;
  currentStatus: string;
  investmentRange: string;
  createdAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const postmarkToken = Deno.env.get('POSTMARK_SERVER_TOKEN') || Deno.env.get('POSTMARK_API_KEY');
    
    if (!postmarkToken) {
      throw new Error('POSTMARK_SERVER_TOKEN is not configured');
    }

    const {
      leadId,
      leadName,
      leadEmail,
      leadPhone,
      fundId,
      fundName,
      managerName,
      currentStatus,
      investmentRange,
      createdAt,
    }: LeadStatusCheckRequest = await req.json();

    console.log('Status check request:', { leadId, fundId, currentStatus });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get fund's manager_name to find company profile
    const { data: fund, error: fundError } = await supabase
      .from('funds')
      .select('manager_name')
      .eq('id', fundId)
      .single();

    if (fundError || !fund) {
      console.error('Error fetching fund:', fundError);
      throw new Error('Fund not found');
    }

    console.log('Found fund manager:', fund.manager_name);

    // Find company profile matching manager_name
    const { data: companyProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, company_name, manager_name')
      .or(`company_name.ilike.%${fund.manager_name}%,manager_name.ilike.%${fund.manager_name}%`)
      .limit(1)
      .single();

    if (profileError || !companyProfile) {
      console.error('Error finding company profile:', profileError);
      throw new Error('Company profile not found');
    }

    console.log('Found company profile:', companyProfile.id);

    // Get all active manager assignments for this company
    const { data: assignments, error: assignmentsError } = await supabase
      .from('manager_profile_assignments')
      .select('user_id')
      .eq('profile_id', companyProfile.id)
      .eq('status', 'active');

    if (assignmentsError) {
      console.error('Error fetching assignments:', assignmentsError);
      throw new Error('Failed to fetch manager assignments');
    }

    if (!assignments || assignments.length === 0) {
      console.log('No active assignments found for company');
      throw new Error('No managers assigned to this fund');
    }

    // Get manager emails from profiles
    const userIds = assignments.map(a => a.user_id);
    const { data: managerProfiles, error: managersError } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .in('user_id', userIds);

    if (managersError) {
      console.error('Error fetching manager profiles:', managersError);
      throw new Error('Failed to fetch manager details');
    }

    const managerEmails = (managerProfiles || [])
      .map(p => p.email)
      .filter(email => email && email.trim().length > 0)
      .map(email => email.trim().toLowerCase());

    const uniqueEmails = [...new Set(managerEmails)];

    console.log(`Sending status check to ${uniqueEmails.length} manager(s):`, uniqueEmails);

    if (uniqueEmails.length === 0) {
      throw new Error('No manager emails found');
    }

    // Calculate days since submission
    const daysSince = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));

    // Format status badge
    const statusBadge = currentStatus === 'won' 
      ? `<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600; font-size: 12px; text-transform: uppercase;">WON</span>`
      : currentStatus === 'closed_lost'
      ? `<span style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600; font-size: 12px; text-transform: uppercase;">CLOSED LOST</span>`
      : `<span style="background: ${BRAND_COLORS.bronze}; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600; font-size: 12px; text-transform: uppercase;">OPEN</span>`;

    // Build lead details content
    const leadDetailsContent = `
      <div style="font-size: 14px; line-height: 1.6; color: ${BRAND_COLORS.textDark};">
        <div style="margin-bottom: 12px;">
          <strong style="color: ${BRAND_COLORS.bordeaux};">Lead Name:</strong> ${leadName}
        </div>
        <div style="margin-bottom: 12px;">
          <strong style="color: ${BRAND_COLORS.bordeaux};">Email:</strong> ${leadEmail}
        </div>
        ${leadPhone ? `
          <div style="margin-bottom: 12px;">
            <strong style="color: ${BRAND_COLORS.bordeaux};">Phone:</strong> ${leadPhone}
          </div>
        ` : ''}
        <div style="margin-bottom: 12px;">
          <strong style="color: ${BRAND_COLORS.bordeaux};">Investment Range:</strong> ${investmentRange}
        </div>
        <div style="margin-bottom: 12px;">
          <strong style="color: ${BRAND_COLORS.bordeaux};">Current Status:</strong> ${statusBadge}
        </div>
        <div style="margin-bottom: 12px;">
          <strong style="color: ${BRAND_COLORS.bordeaux};">Date Submitted:</strong> ${new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div style="margin-bottom: 12px;">
          <strong style="color: ${BRAND_COLORS.bordeaux};">Days Since Submission:</strong> ${daysSince} days
        </div>
      </div>
    `;

    // Build instructions content
    const instructionsContent = `
      <div style="font-size: 15px; line-height: 1.8; color: ${BRAND_COLORS.textDark};">
        <p style="margin-bottom: 12px;">Please review the lead details above and update the status if needed:</p>
        <ul style="margin: 16px 0; padding-left: 24px;">
          <li style="margin-bottom: 8px;"><strong>If the lead is still Open</strong>, no action is needed - keep it as Open.</li>
          <li style="margin-bottom: 8px;"><strong>If the lead has been Won</strong>, please update the status to Won.</li>
          <li style="margin-bottom: 8px;"><strong>If the lead is Closed Lost</strong>, please update the status to Closed Lost.</li>
        </ul>
        <p style="margin-top: 20px; padding: 16px; background: ${BRAND_COLORS.bone}; border-radius: 6px; border-left: 4px solid ${BRAND_COLORS.bronze};">
          <strong>Note:</strong> We will also be contacting the lead directly to verify status.
        </p>
      </div>
    `;

    const bodyContent = `
      <p style="font-size: 16px; line-height: 1.6; color: ${BRAND_COLORS.textDark}; margin-bottom: 24px;">
        Hello,
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: ${BRAND_COLORS.textDark}; margin-bottom: 24px;">
        We're conducting a status check on one of your leads for <strong>${fundName}</strong>. Please review the lead details below and update the status if needed.
      </p>
      ${generateContentCard(leadDetailsContent, 'bordeaux')}
      ${generateContentCard(instructionsContent, 'bronze')}
      ${generateCTAButton('Update Lead Status', `https://funds.movingto.com/manage-fund/${fundId}?tab=leads`, 'bordeaux')}
    `;

    const htmlContent = generateEmailWrapper(
      `Please Verify Lead Status: ${leadName}`,
      bodyContent
    );

    // Send email to all managers using Postmark
    const emailPromises = uniqueEmails.map(email => 
      fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': postmarkToken,
        },
        body: JSON.stringify({
          From: 'noreply@movingto.com',
          To: email,
          Subject: `Please Verify Lead Status: ${leadName} - ${fundName}`,
          HtmlBody: htmlContent,
          MessageStream: 'outbound',
        }),
      }).then(res => res.json())
    );

    const results = await Promise.allSettled(emailPromises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Status check emails sent: ${successful} successful, ${failed} failed`);

    if (failed > 0) {
      console.error('Some emails failed:', results.filter(r => r.status === 'rejected'));
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailsSent: successful,
        emailsFailed: failed,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in request-lead-status-check:", error);
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
