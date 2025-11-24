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

interface EnquiryData {
  fundId?: string | null; // Optional for general manager enquiries
  fundName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  investmentAmountRange: string;
  interestAreas: string[];
  message: string;
  userId?: string;
  sessionId?: string;
  referrer?: string;
  userAgent?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const postmarkApiKey = Deno.env.get('POSTMARK_SERVER_TOKEN') || Deno.env.get('POSTMARK_API_KEY');
    
    if (!postmarkApiKey) {
      console.error('Missing Postmark API token');
      return new Response(
        JSON.stringify({ error: 'Email service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const enquiryData: EnquiryData = await req.json();
    
    // Validate required fields (fundId is now optional for general manager enquiries)
    if (!enquiryData.firstName || !enquiryData.lastName || 
        !enquiryData.email || !enquiryData.message || !enquiryData.investmentAmountRange) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Rate limiting check - max 3 enquiries per email per day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentEnquiries, error: rateLimitError } = await supabase
      .from('fund_enquiries')
      .select('id')
      .eq('email', enquiryData.email)
      .gte('created_at', oneDayAgo);
    
    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    }
    
    if (recentEnquiries && recentEnquiries.length >= 3) {
      return new Response(
        JSON.stringify({ error: 'Too many enquiries. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Insert enquiry into database (fund_id can be null for general enquiries)
    const { data: enquiry, error: insertError } = await supabase
      .from('fund_enquiries')
      .insert({
        fund_id: enquiryData.fundId || null,
        first_name: enquiryData.firstName,
        last_name: enquiryData.lastName,
        email: enquiryData.email,
        phone: enquiryData.phone || null,
        message: enquiryData.message,
        investment_amount_range: enquiryData.investmentAmountRange,
        interest_areas: enquiryData.interestAreas,
        user_id: enquiryData.userId || null,
        session_id: enquiryData.sessionId || null,
        referrer: enquiryData.referrer || null,
        user_agent: enquiryData.userAgent || null,
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save enquiry' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get fund details to find manager_name (if this is a fund-specific enquiry)
    let fund: { manager_name: string } | null = null;
    
    if (enquiryData.fundId) {
      const { data: fundData, error: fundError } = await supabase
        .from('funds')
        .select('manager_name')
        .eq('id', enquiryData.fundId)
        .single();
      
      if (fundError) {
        console.error('Error fetching fund:', fundError);
      } else {
        fund = fundData;
      }
    } else {
      // For general enquiries, try to extract manager_name from fundName
      // This assumes fundName contains the company name
      console.log('General manager enquiry - using fundName as manager_name:', enquiryData.fundName);
      fund = { manager_name: enquiryData.fundName };
    }
    
    // Collect all recipient emails
    const recipientEmails: string[] = [];
    
    // Get assigned managers using company-centric model
    if (fund?.manager_name) {
      // First, find the company profile
      const { data: companyProfile, error: companyError } = await supabase
        .from('profiles')
        .select('id')
        .eq('company_name', fund.manager_name)
        .single();
      
      if (companyError) {
        console.error('Error fetching company profile:', companyError);
      }
      
      // Then get all users assigned to this company (two-step approach)
      if (companyProfile) {
        // Step 1: Get user_ids from assignments
        const { data: assignments, error: assignmentsError } = await supabase
          .from('manager_profile_assignments')
          .select('user_id')
          .eq('profile_id', companyProfile.id)
          .eq('status', 'active');
        
        if (assignmentsError) {
          console.error('Error fetching assigned managers:', assignmentsError);
        }
        
        // Step 2: Get emails from profiles using the user_ids
        if (assignments && assignments.length > 0) {
          const userIds = assignments.map(a => a.user_id);
          
          const { data: managerProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('email')
            .in('user_id', userIds);
          
          if (profilesError) {
            console.error('Error fetching manager profiles:', profilesError);
          }
          
          // Add manager emails to recipient list
          if (managerProfiles && managerProfiles.length > 0) {
            for (const profile of managerProfiles) {
              if (profile.email) {
                recipientEmails.push(profile.email);
              }
            }
          }
        }
      }
    }
    
    // Get additional notification emails (only for fund-specific enquiries)
    let additionalEmails: { email: string }[] = [];
    
    if (enquiryData.fundId) {
      const { data, error: additionalEmailsError } = await supabase
        .from('fund_lead_notification_emails')
        .select('email')
        .eq('fund_id', enquiryData.fundId);
      
      if (additionalEmailsError) {
        console.error('Error fetching additional notification emails:', additionalEmailsError);
      } else {
        additionalEmails = data || [];
      }
    }
    
    // Add additional notification emails
    if (additionalEmails.length > 0) {
      for (const item of additionalEmails) {
        if (item.email) {
          recipientEmails.push(item.email);
        }
      }
    }
    
    // Normalize and deduplicate emails
    const uniqueEmails = [...new Set(
      recipientEmails
        .map(email => email.trim().toLowerCase())
        .filter(email => email.length > 0)
    )];
    
    console.log('Email recipients:', { 
      fundId: enquiryData.fundId, 
      fundName: enquiryData.fundName,
      managerName: fund?.manager_name,
      recipientCount: uniqueEmails.length,
      recipients: uniqueEmails 
    });
    
    // Send emails to all recipients
    if (uniqueEmails.length > 0) {
      const managerEmail = generateManagerNotificationEmail(
        enquiryData,
        'Fund Manager'
      );
      
      for (const email of uniqueEmails) {
        try {
          const response = await fetch(POSTMARK_API_URL, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-Postmark-Server-Token': postmarkApiKey,
            },
            body: JSON.stringify({
              From: 'noreply@movingto.com',
              To: email,
              Subject: `🚀 New Enquiry for ${enquiryData.fundName}`,
              HtmlBody: managerEmail.html,
              TextBody: managerEmail.text,
              MessageStream: 'outbound',
            }),
          });
          
          if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Postmark error for ${email}:`, { status: response.status, body: errorBody });
          } else {
            console.log(`Notification sent to: ${email}`);
          }
        } catch (emailError) {
          console.error(`Error sending email to ${email}:`, emailError);
        }
      }
    } else {
      console.warn('No recipients found for fund lead notification');
    }
    
    // Send confirmation email to investor
    const investorEmail = generateInvestorConfirmationEmail(enquiryData);
    
    try {
      const response = await fetch(POSTMARK_API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': postmarkApiKey,
        },
        body: JSON.stringify({
          From: 'noreply@movingto.com',
          To: enquiryData.email,
          Subject: `Thank you for your enquiry about ${enquiryData.fundName}`,
          HtmlBody: investorEmail.html,
          TextBody: investorEmail.text,
          MessageStream: 'outbound',
        }),
      });
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Postmark error for investor confirmation:', { status: response.status, body: errorBody });
      } else {
        console.log('Investor confirmation sent');
      }
    } catch (emailError) {
      console.error('Error sending investor confirmation:', emailError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        enquiryId: enquiry.id,
        message: 'Enquiry submitted successfully' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing enquiry:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateManagerNotificationEmail(enquiry: EnquiryData, managerName: string) {
  const html = `
    ${generateEmailHeader('')}
    
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: ${BRAND_COLORS.bordeaux}; margin-top: 0;">🚀 New Enquiry for ${enquiry.fundName}</h1>
      
      <div style="background: ${BRAND_COLORS.bone}; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${BRAND_COLORS.bronze};">
        <p style="margin: 0 0 10px 0; color: ${BRAND_COLORS.textDark}; font-size: 16px; font-weight: 600;">Hello ${managerName},</p>
        <p style="margin: 0; color: ${BRAND_COLORS.textMuted};">You have a new prospective investor! Click the button below to sign in and view their complete details in your Leads tab.</p>
      </div>
      
      <div style="background: linear-gradient(135deg, ${BRAND_COLORS.bordeaux}10, ${BRAND_COLORS.bronze}10); padding: 25px; border-radius: 8px; margin: 25px 0; border: 2px solid ${BRAND_COLORS.bordeaux};">
        <h2 style="margin-top: 0; color: ${BRAND_COLORS.bordeaux}; font-size: 18px;">⚠️ Important Reminders</h2>
        <ul style="color: ${BRAND_COLORS.textDark}; line-height: 1.8; padding-left: 20px; margin: 10px 0 0 0;">
          <li><strong>Sign in first:</strong> Click the button below to access your dashboard, then navigate to the Leads tab to view full contact information</li>
          <li><strong>Update the lead status</strong> (Open, Closed Lost, or Won) to keep accurate records</li>
          <li><strong>Status verification:</strong> We verify lead statuses with clients - please ensure accuracy to avoid discrepancies</li>
          <li><strong>Direct contact:</strong> Feel free to arrange a call directly with the lead using the contact information provided</li>
        </ul>
      </div>
      
      <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid ${BRAND_COLORS.bone};">
        <h2 style="margin-top: 0; color: ${BRAND_COLORS.bordeaux}; font-size: 18px;">Lead Preview</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600; width: 40%;">Name:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark};">${enquiry.firstName} ${enquiry.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${enquiry.email}" style="color: ${BRAND_COLORS.bronze};">${enquiry.email}</a></td>
          </tr>
          ${enquiry.phone ? `<tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Phone:</td>
            <td style="padding: 8px 0;"><a href="tel:${enquiry.phone}" style="color: ${BRAND_COLORS.bronze};">${enquiry.phone}</a></td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Investment Range:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark};">${enquiry.investmentAmountRange}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600; vertical-align: top;">Interest Areas:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark};">${enquiry.interestAreas.join(', ')}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid ${BRAND_COLORS.bone};">
          <p style="margin: 0 0 10px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Message:</p>
          <p style="margin: 0; color: ${BRAND_COLORS.textDark}; line-height: 1.6;">${enquiry.message}</p>
        </div>
      </div>
      
      ${generateCTAButton('Sign In to View Lead', `https://funds.movingto.com`, 'bordeaux')}
      
      <div style="background: ${BRAND_COLORS.bone}; padding: 20px; border-radius: 6px; margin-top: 25px;">
        <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px; line-height: 1.6;">
          💡 <strong>Tip:</strong> Investors typically contact multiple funds. Respond within 24 hours to maximize your chances of conversion.
        </p>
      </div>
    </div>
    
    ${generateEmailFooter()}
  `;
  
  const text = `
New Enquiry for ${enquiry.fundName}

Hello ${managerName},

You have a new prospective investor! Sign in to your dashboard to view their complete details.

⚠️ IMPORTANT REMINDERS:
✓ Sign in to your dashboard to view full lead details and contact information
✓ Update the lead status (Open, Closed Lost, or Won) to keep accurate records
✓ Status verification: We verify lead statuses with clients - please ensure accuracy to avoid discrepancies
✓ Direct contact: Feel free to arrange a call directly with the lead using the contact information provided

Lead Preview:
- Name: ${enquiry.firstName} ${enquiry.lastName}
- Email: ${enquiry.email}
${enquiry.phone ? `- Phone: ${enquiry.phone}` : ''}
- Investment Range: ${enquiry.investmentAmountRange}
- Interest Areas: ${enquiry.interestAreas.join(', ')}

Message:
${enquiry.message}

Sign in to view lead: https://funds.movingto.com

Tip: Investors typically contact multiple funds. Respond within 24 hours to maximize your chances of conversion.

---
Moving To Global Pte Ltd
160 Robinson Road, #14-04, Singapore Business Federation Center, Singapore, 068914
  `;
  
  return { html, text };
}

function generateInvestorConfirmationEmail(enquiry: EnquiryData) {
  const html = `
    ${generateEmailHeader('')}
    
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: ${BRAND_COLORS.bordeaux}; margin-top: 0;">Thank you for your enquiry</h1>
      
      <div style="background: ${BRAND_COLORS.bone}; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <p style="margin: 0 0 10px 0; color: ${BRAND_COLORS.textDark}; font-size: 16px;">Hello ${enquiry.firstName},</p>
        <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; line-height: 1.6;">
          We've received your enquiry about <strong>${enquiry.fundName}</strong> and have notified the fund manager.
        </p>
      </div>
      
      <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid ${BRAND_COLORS.bone};">
        <h2 style="margin-top: 0; color: ${BRAND_COLORS.bordeaux}; font-size: 18px;">What happens next?</h2>
        <ul style="color: ${BRAND_COLORS.textDark}; line-height: 1.8; padding-left: 20px;">
          <li>The fund manager typically responds within 24-48 hours</li>
          <li>They will answer your questions and provide additional information</li>
          <li>You can schedule a consultation call to discuss your investment goals</li>
        </ul>
      </div>
      
      ${enquiry.fundId 
        ? generateCTAButton('View Fund Details', `https://funds.movingto.com/${enquiry.fundId}`, 'bordeaux')
        : generateCTAButton('Browse Funds', `https://funds.movingto.com/`, 'bordeaux')
      }
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid ${BRAND_COLORS.bone};">
        <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px; line-height: 1.6;">
          If you have any questions about our platform, please contact us at <a href="mailto:support@movingto.com" style="color: ${BRAND_COLORS.bronze};">support@movingto.com</a>
        </p>
      </div>
    </div>
    
    ${generateEmailFooter()}
  `;
  
  const text = `
Thank you for your enquiry

Hello ${enquiry.firstName},

We've received your enquiry about ${enquiry.fundName} and have notified the fund manager.

What happens next?
- The fund manager typically responds within 24-48 hours
- They will answer your questions and provide additional information
- You can schedule a consultation call to discuss your investment goals

View Fund Details: https://funds.movingto.com/funds/${enquiry.fundId}

If you have any questions about our platform, please contact us at support@movingto.com

---
Moving To Global Pte Ltd
160 Robinson Road, #14-04, Singapore Business Federation Center, Singapore, 068914
  `;
  
  return { html, text };
}
