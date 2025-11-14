import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import {
  generateEmailWrapper,
  generateContentCard,
  generateCTAButton,
  BRAND_COLORS,
} from "../_shared/email-templates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StaleLeadReminderRequest {
  test_mode?: boolean;
  test_email_override?: string;
  days_threshold?: number;
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const {
      test_mode = false,
      test_email_override,
      days_threshold = 7,
    }: StaleLeadReminderRequest = await req.json().catch(() => ({}));

    console.log(`Starting stale lead reminder check (${days_threshold} days threshold, test_mode: ${test_mode})`);

    // Query for stale leads
    const { data: staleLeads, error: leadsError } = await supabase
      .from('fund_enquiries')
      .select('id, fund_id, first_name, last_name, email, phone, investment_amount_range, status, created_at, updated_at')
      .in('status', ['open', 'contacted'])
      .lt('updated_at', new Date(Date.now() - days_threshold * 24 * 60 * 60 * 1000).toISOString());

    if (leadsError) {
      console.error('Error fetching stale leads:', leadsError);
      throw new Error('Failed to fetch stale leads');
    }

    if (!staleLeads || staleLeads.length === 0) {
      console.log('No stale leads found');
      return new Response(
        JSON.stringify({ 
          success: true, 
          reminders_sent: 0,
          message: 'No stale leads found' 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${staleLeads.length} stale lead(s)`);

    const results = {
      reminders_sent: 0,
      errors: 0,
      details: [] as any[],
    };

    // Process each stale lead
    for (const lead of staleLeads) {
      try {
        // Get fund details
        const { data: fund, error: fundError } = await supabase
          .from('funds')
          .select('id, name, manager_name')
          .eq('id', lead.fund_id)
          .single();

        if (fundError || !fund) {
          console.error(`Error fetching fund for lead ${lead.id}:`, fundError);
          results.errors++;
          results.details.push({ lead_id: lead.id, error: 'Fund not found' });
          continue;
        }

        // Find company profile
        const { data: companyProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id, company_name, manager_name')
          .or(`company_name.ilike.%${fund.manager_name}%,manager_name.ilike.%${fund.manager_name}%`)
          .limit(1)
          .single();

        if (profileError || !companyProfile) {
          console.error(`Error finding company profile for lead ${lead.id}:`, profileError);
          results.errors++;
          results.details.push({ lead_id: lead.id, error: 'Company profile not found' });
          continue;
        }

        // Get active manager assignments
        const { data: assignments, error: assignmentsError } = await supabase
          .from('manager_profile_assignments')
          .select('user_id')
          .eq('profile_id', companyProfile.id)
          .eq('status', 'active');

        if (assignmentsError || !assignments || assignments.length === 0) {
          console.error(`No active managers found for lead ${lead.id}`);
          results.errors++;
          results.details.push({ lead_id: lead.id, error: 'No active managers' });
          continue;
        }

        // Get manager emails
        const userIds = assignments.map(a => a.user_id);
        const { data: managerProfiles, error: managersError } = await supabase
          .from('profiles')
          .select('email, first_name, last_name')
          .in('user_id', userIds);

        if (managersError || !managerProfiles) {
          console.error(`Error fetching manager profiles for lead ${lead.id}:`, managersError);
          results.errors++;
          results.details.push({ lead_id: lead.id, error: 'Failed to fetch manager profiles' });
          continue;
        }

        const managerEmails = (managerProfiles || [])
          .map(p => p.email)
          .filter(email => email && email.trim().length > 0)
          .map(email => email.trim().toLowerCase());

        const uniqueEmails = [...new Set(managerEmails)];

        if (uniqueEmails.length === 0) {
          console.error(`No manager emails found for lead ${lead.id}`);
          results.errors++;
          results.details.push({ lead_id: lead.id, error: 'No manager emails' });
          continue;
        }

        // Calculate days since last update
        const daysSinceUpdate = Math.floor((Date.now() - new Date(lead.updated_at).getTime()) / (1000 * 60 * 60 * 24));

        // Generate email content
        const leadName = `${lead.first_name} ${lead.last_name}`;
        const statusBadge = lead.status === 'contacted'
          ? `<span style="background: ${BRAND_COLORS.bronze}; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600; font-size: 12px; text-transform: uppercase;">CONTACTED</span>`
          : `<span style="background: ${BRAND_COLORS.bronze}; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600; font-size: 12px; text-transform: uppercase;">OPEN</span>`;

        const leadDetailsContent = `
          <div style="font-size: 14px; line-height: 1.6; color: ${BRAND_COLORS.textDark};">
            <div style="margin-bottom: 12px;">
              <strong style="color: ${BRAND_COLORS.bordeaux};">Lead Name:</strong> ${leadName}
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: ${BRAND_COLORS.bordeaux};">Email:</strong> ${lead.email}
            </div>
            ${lead.phone ? `
              <div style="margin-bottom: 12px;">
                <strong style="color: ${BRAND_COLORS.bordeaux};">Phone:</strong> ${lead.phone}
              </div>
            ` : ''}
            <div style="margin-bottom: 12px;">
              <strong style="color: ${BRAND_COLORS.bordeaux};">Investment Range:</strong> ${lead.investment_amount_range || 'Not specified'}
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: ${BRAND_COLORS.bordeaux};">Current Status:</strong> ${statusBadge}
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: ${BRAND_COLORS.bordeaux};">Last Updated:</strong> ${daysSinceUpdate} day${daysSinceUpdate !== 1 ? 's' : ''} ago
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: ${BRAND_COLORS.bordeaux};">Date Submitted:</strong> ${new Date(lead.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        `;

        const instructionsContent = `
          <div style="font-size: 15px; line-height: 1.8; color: ${BRAND_COLORS.textDark};">
            <p style="margin-bottom: 12px; font-weight: 600; color: ${BRAND_COLORS.bordeaux};">
              ⏰ This lead hasn't been updated in ${daysSinceUpdate} days
            </p>
            <p style="margin-bottom: 12px;">Please review the lead details above and update the status if needed:</p>
            <ul style="margin: 16px 0; padding-left: 24px;">
              <li style="margin-bottom: 8px;"><strong>If the lead is still Open/Contacted</strong>, no action is needed.</li>
              <li style="margin-bottom: 8px;"><strong>If the lead has been Won</strong>, please update the status to Won.</li>
              <li style="margin-bottom: 8px;"><strong>If the lead is Closed Lost</strong>, please update the status to Closed Lost.</li>
            </ul>
            <p style="margin-top: 20px; padding: 16px; background: ${BRAND_COLORS.bone}; border-radius: 6px; border-left: 4px solid ${BRAND_COLORS.bronze};">
              <strong>Note:</strong> Regular status updates help us maintain accurate lead tracking and improve our service to potential investors.
            </p>
          </div>
        `;

        const bodyContent = `
          <p style="font-size: 16px; line-height: 1.6; color: ${BRAND_COLORS.textDark}; margin-bottom: 24px;">
            Hello,
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: ${BRAND_COLORS.textDark}; margin-bottom: 24px;">
            We noticed that a lead for <strong>${fund.name}</strong> hasn't been updated recently. Please take a moment to review and update the lead status.
          </p>
          ${generateContentCard(leadDetailsContent, 'bordeaux')}
          ${generateContentCard(instructionsContent, 'bronze')}
          ${generateCTAButton('Update Lead Status', `https://funds.movingto.com/manage-fund/${lead.fund_id}?tab=leads`, 'bordeaux')}
        `;

        const htmlContent = generateEmailWrapper(
          `Status Update Needed: ${leadName}`,
          bodyContent
        );

        // Send emails to managers
        const emailsToSend = test_mode && test_email_override 
          ? [test_email_override] 
          : uniqueEmails;

        for (const email of emailsToSend) {
          try {
            const emailResponse = await fetch('https://api.postmarkapp.com/email', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Postmark-Server-Token': postmarkToken,
              },
              body: JSON.stringify({
                From: 'noreply@movingto.com',
                To: email,
                Subject: `Status Update Needed: ${leadName} - ${fund.name}`,
                HtmlBody: htmlContent,
                MessageStream: 'outbound',
              }),
            });

            const emailResult = await emailResponse.json();

            // Log email to database
            await supabase
              .from('fund_manager_email_logs')
              .insert({
                fund_id: lead.fund_id,
                manager_email: email,
                manager_name: fund.manager_name,
                email_type: 'stale_lead_reminder',
                subject: `Status Update Needed: ${leadName} - ${fund.name}`,
                postmark_message_id: emailResult.MessageID || null,
                test_mode: test_mode,
                error_message: emailResponse.ok ? null : JSON.stringify(emailResult),
              });

            if (emailResponse.ok) {
              results.reminders_sent++;
              console.log(`Sent reminder for lead ${lead.id} to ${email}`);
            } else {
              results.errors++;
              console.error(`Failed to send reminder for lead ${lead.id} to ${email}:`, emailResult);
            }
          } catch (emailError) {
            results.errors++;
            console.error(`Error sending email for lead ${lead.id}:`, emailError);
          }
        }

        results.details.push({
          lead_id: lead.id,
          lead_name: leadName,
          fund_name: fund.name,
          emails_sent: emailsToSend.length,
        });

      } catch (leadError) {
        results.errors++;
        console.error(`Error processing lead ${lead.id}:`, leadError);
        results.details.push({ lead_id: lead.id, error: leadError.message });
      }
    }

    console.log(`Stale lead reminder summary: ${results.reminders_sent} sent, ${results.errors} errors`);

    return new Response(
      JSON.stringify({ 
        success: true,
        reminders_sent: results.reminders_sent,
        errors: results.errors,
        leads_processed: staleLeads.length,
        details: results.details,
        test_mode: test_mode,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in weekly-stale-lead-reminder:", error);
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
