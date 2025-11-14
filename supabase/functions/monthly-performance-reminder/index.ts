import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import {
  generateMonthlyPerformanceReminderEmail,
  generateMonthlyPerformanceReminderEmailUnverified,
} from '../_shared/email-templates.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MonthlyReminderRequest {
  test_mode?: boolean;
  test_email_override?: string;
  test_fund_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const postmarkToken = Deno.env.get('POSTMARK_SERVER_TOKEN') || Deno.env.get('POSTMARK_API_KEY');

    if (!postmarkToken) {
      throw new Error('POSTMARK_SERVER_TOKEN is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json() as MonthlyReminderRequest;
    
    // Get current month/year for email content
    const now = new Date();
    const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    console.log('Monthly performance reminder started', {
      month_year: monthYear,
      test_mode: body.test_mode,
      test_email_override: body.test_email_override,
      test_fund_id: body.test_fund_id,
    });

    // Fetch all funds or single test fund
    const fundsQuery = supabase
      .from('funds')
      .select('id, name, is_verified, manager_name');
    
    if (body.test_fund_id) {
      fundsQuery.eq('id', body.test_fund_id);
    }

    const { data: funds, error: fundsError } = await fundsQuery;

    if (fundsError) {
      console.error('Error fetching funds:', fundsError);
      throw fundsError;
    }

    console.log(`Processing ${funds?.length || 0} funds`);

    let successCount = 0;
    let errorCount = 0;
    const errors: any[] = [];

    // Process each fund
    for (const fund of funds || []) {
      try {
        // Get fund managers via company assignment
        const { data: assignments, error: assignmentError } = await supabase
          .from('manager_profile_assignments')
          .select(`
            user_id,
            profiles!inner(
              email,
              manager_name,
              first_name,
              last_name,
              company_name
            )
          `)
          .eq('profiles.company_name', fund.manager_name)
          .eq('status', 'active');

        if (assignmentError) {
          console.error(`Error fetching managers for fund ${fund.id}:`, assignmentError);
          errorCount++;
          errors.push({ fund_id: fund.id, error: assignmentError.message });
          continue;
        }

        if (!assignments || assignments.length === 0) {
          console.log(`No managers assigned to fund ${fund.id}`);
          continue;
        }

        // Get unique manager emails
        const managerEmails = new Set<string>();
        const managerData: Record<string, { email: string; name: string }> = {};

        for (const assignment of assignments) {
          const profile = assignment.profiles as any;
          if (profile?.email) {
            const email = profile.email.trim().toLowerCase();
            managerEmails.add(email);
            managerData[email] = {
              email: profile.email,
              name: profile.manager_name || 
                    `${profile.first_name || ''} ${profile.last_name || ''}`.trim() ||
                    profile.email.split('@')[0],
            };
          }
        }

        // Send email to each manager
        for (const email of managerEmails) {
          const manager = managerData[email];
          const recipientEmail = body.test_email_override || manager.email;
          const fundUrl = `https://funds.movingto.com/manage-fund/${fund.id}`;

          // Generate appropriate email based on verification status
          const emailTemplate = fund.is_verified
            ? generateMonthlyPerformanceReminderEmail
            : generateMonthlyPerformanceReminderEmailUnverified;

          const { html, text } = emailTemplate({
            fundName: fund.name,
            monthYear,
            managerName: manager.name,
            fundUrl,
            recipientEmail,
          });

          const subject = `Monthly Performance Update - ${monthYear}`;

          // Send via Postmark
          const postmarkResponse = await fetch('https://api.postmarkapp.com/email', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-Postmark-Server-Token': postmarkToken,
            },
            body: JSON.stringify({
              From: 'Movingto Funds <noreply@movingto.com>',
              To: recipientEmail,
              Subject: subject,
              HtmlBody: html,
              TextBody: text,
              MessageStream: 'outbound',
              TrackOpens: true,
              TrackLinks: 'HtmlAndText',
            }),
          });

          if (!postmarkResponse.ok) {
            const errorText = await postmarkResponse.text();
            throw new Error(`Postmark error: ${errorText}`);
          }

          const postmarkResult = await postmarkResponse.json();
          console.log(`Email sent to ${recipientEmail}:`, postmarkResult.MessageID);

          // Log to database
          await supabase.from('fund_manager_email_logs').insert({
            postmark_message_id: postmarkResult.MessageID,
            email_type: 'monthly_performance_reminder',
            fund_id: fund.id,
            manager_email: recipientEmail,
            manager_name: manager.name,
            subject,
            is_verified_fund: fund.is_verified || false,
            sent_at: new Date().toISOString(),
            test_mode: body.test_mode || false,
          });

          successCount++;
        }
      } catch (fundError: any) {
        console.error(`Error processing fund ${fund.id}:`, fundError);
        errorCount++;
        errors.push({ fund_id: fund.id, error: fundError.message });
      }
    }

    console.log(`Monthly reminder completed: ${successCount} sent, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        errors: errorCount,
        error_details: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Monthly reminder error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
