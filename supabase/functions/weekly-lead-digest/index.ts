import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { 
  generateEmailHeader, 
  generateEmailFooter, 
  BRAND_COLORS 
} from '../_shared/email-templates.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const POSTMARK_API_URL = 'https://api.postmarkapp.com/email';
const DEAN_EMAIL = 'dean@movingto.com';

interface LeadSummary {
  fundId: string;
  fundName: string;
  newLeads: number;
  wonLeads: number;
  closedLostLeads: number;
  conversionRate: number;
  totalValue: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const postmarkApiKey = Deno.env.get('POSTMARK_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Calculate date range (last 7 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    console.log(`Generating weekly digest from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    // Fetch all leads from the past week
    const { data: weeklyLeads, error: leadsError } = await supabase
      .from('fund_enquiries')
      .select('*, funds(name)')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });
    
    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      throw new Error('Failed to fetch leads');
    }
    
    // Fetch status changes from the past week
    const { data: allLeads, error: allLeadsError } = await supabase
      .from('fund_enquiries')
      .select('id, status, updated_at, created_at, fund_id, funds(name)')
      .lte('updated_at', endDate.toISOString());
    
    if (allLeadsError) {
      console.error('Error fetching all leads:', allLeadsError);
    }
    
    // Calculate metrics
    const totalNewLeads = weeklyLeads?.length || 0;
    const statusChanges = allLeads?.filter(lead => {
      const updatedAt = new Date(lead.updated_at);
      const createdAt = new Date(lead.created_at);
      return updatedAt >= startDate && updatedAt.getTime() !== createdAt.getTime();
    }) || [];
    
    // Group leads by fund
    const fundSummaries: Record<string, LeadSummary> = {};
    
    weeklyLeads?.forEach(lead => {
      const fundId = lead.fund_id;
      const fundName = (lead.funds as any)?.name || 'Unknown Fund';
      
      if (!fundSummaries[fundId]) {
        fundSummaries[fundId] = {
          fundId,
          fundName,
          newLeads: 0,
          wonLeads: 0,
          closedLostLeads: 0,
          conversionRate: 0,
          totalValue: 'N/A'
        };
      }
      
      fundSummaries[fundId].newLeads++;
      
      if (lead.status === 'won') {
        fundSummaries[fundId].wonLeads++;
      } else if (lead.status === 'closed_lost') {
        fundSummaries[fundId].closedLostLeads++;
      }
    });
    
    // Calculate conversion rates
    Object.values(fundSummaries).forEach(summary => {
      const totalClosed = summary.wonLeads + summary.closedLostLeads;
      if (totalClosed > 0) {
        summary.conversionRate = (summary.wonLeads / totalClosed) * 100;
      }
    });
    
    // Sort funds by new leads (descending)
    const sortedFunds = Object.values(fundSummaries).sort((a, b) => b.newLeads - a.newLeads);
    
    // Calculate overall metrics
    const totalWon = sortedFunds.reduce((sum, f) => sum + f.wonLeads, 0);
    const totalClosedLost = sortedFunds.reduce((sum, f) => sum + f.closedLostLeads, 0);
    const totalClosed = totalWon + totalClosedLost;
    const overallConversionRate = totalClosed > 0 ? (totalWon / totalClosed) * 100 : 0;
    
    // Generate and send email
    const email = generateDigestEmail({
      startDate,
      endDate,
      totalNewLeads,
      totalWon,
      totalClosedLost,
      overallConversionRate,
      statusChangesCount: statusChanges.length,
      fundSummaries: sortedFunds
    });
    
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
        Subject: `Weekly Lead Digest - ${totalNewLeads} New Leads`,
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
    
    console.log('Weekly digest sent successfully');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Weekly digest sent',
        totalNewLeads,
        fundsCount: sortedFunds.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error generating weekly digest:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate digest',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

interface DigestData {
  startDate: Date;
  endDate: Date;
  totalNewLeads: number;
  totalWon: number;
  totalClosedLost: number;
  overallConversionRate: number;
  statusChangesCount: number;
  fundSummaries: LeadSummary[];
}

function generateDigestEmail(data: DigestData) {
  const dateRange = `${data.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${data.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  
  const html = `
    ${generateEmailHeader()}
    
    <div style="max-width: 700px; margin: 0 auto; padding: 20px;">
      <h1 style="color: ${BRAND_COLORS.bordeaux}; margin-top: 0;">📊 Weekly Lead Digest</h1>
      
      <div style="background: ${BRAND_COLORS.bone}; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${BRAND_COLORS.bronze};">
        <p style="margin: 0 0 5px 0; color: ${BRAND_COLORS.textDark}; font-size: 16px; font-weight: 600;">Period: ${dateRange}</p>
        <p style="margin: 0; color: ${BRAND_COLORS.textMuted};">Your weekly summary of lead activity across all investment funds.</p>
      </div>
      
      <!-- Overall Metrics -->
      <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid ${BRAND_COLORS.bone};">
        <h2 style="margin-top: 0; color: ${BRAND_COLORS.bordeaux}; font-size: 20px;">📈 Overall Performance</h2>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
          <div style="background: ${BRAND_COLORS.bone}; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 36px; font-weight: bold; color: ${BRAND_COLORS.bordeaux}; margin-bottom: 5px;">${data.totalNewLeads}</div>
            <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: ${BRAND_COLORS.textMuted};">New Leads</div>
          </div>
          
          <div style="background: ${BRAND_COLORS.bone}; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 36px; font-weight: bold; color: #10B981; margin-bottom: 5px;">${data.totalWon}</div>
            <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: ${BRAND_COLORS.textMuted};">Conversions</div>
          </div>
          
          <div style="background: ${BRAND_COLORS.bone}; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 36px; font-weight: bold; color: #EF4444; margin-bottom: 5px;">${data.totalClosedLost}</div>
            <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: ${BRAND_COLORS.textMuted};">Closed Lost</div>
          </div>
          
          <div style="background: ${BRAND_COLORS.bone}; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 36px; font-weight: bold; color: ${BRAND_COLORS.bronze}; margin-bottom: 5px;">${data.overallConversionRate.toFixed(1)}%</div>
            <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: ${BRAND_COLORS.textMuted};">Conversion Rate</div>
          </div>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid ${BRAND_COLORS.bone};">
          <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px;">
            📝 <strong>${data.statusChangesCount}</strong> status changes recorded this week
          </p>
        </div>
      </div>
      
      <!-- Fund-by-Fund Breakdown -->
      ${data.fundSummaries.length > 0 ? `
      <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid ${BRAND_COLORS.bone};">
        <h2 style="margin-top: 0; color: ${BRAND_COLORS.bordeaux}; font-size: 20px;">🎯 Fund Performance</h2>
        
        ${data.fundSummaries.map((fund, index) => `
          <div style="background: ${index % 2 === 0 ? BRAND_COLORS.bone : 'white'}; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid ${BRAND_COLORS.bronze};">
            <h3 style="margin: 0 0 15px 0; color: ${BRAND_COLORS.textDark}; font-size: 16px; font-weight: 600;">${fund.fundName}</h3>
            
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
              <div>
                <div style="font-size: 24px; font-weight: bold; color: ${BRAND_COLORS.bordeaux};">${fund.newLeads}</div>
                <div style="font-size: 11px; text-transform: uppercase; color: ${BRAND_COLORS.textMuted};">New Leads</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: bold; color: #10B981;">${fund.wonLeads}</div>
                <div style="font-size: 11px; text-transform: uppercase; color: ${BRAND_COLORS.textMuted};">Won</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: bold; color: #EF4444;">${fund.closedLostLeads}</div>
                <div style="font-size: 11px; text-transform: uppercase; color: ${BRAND_COLORS.textMuted};">Lost</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: bold; color: ${BRAND_COLORS.bronze};">${fund.conversionRate > 0 ? fund.conversionRate.toFixed(1) + '%' : '—'}</div>
                <div style="font-size: 11px; text-transform: uppercase; color: ${BRAND_COLORS.textMuted};">Conv. Rate</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      ` : `
      <div style="background: ${BRAND_COLORS.bone}; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
        <p style="margin: 0; color: ${BRAND_COLORS.textMuted};">No leads recorded this week.</p>
      </div>
      `}
      
      <!-- Action Items -->
      <div style="background: linear-gradient(135deg, ${BRAND_COLORS.bordeaux}10, ${BRAND_COLORS.bronze}10); padding: 25px; border-radius: 8px; margin: 25px 0; border: 2px solid ${BRAND_COLORS.bordeaux};">
        <h2 style="margin-top: 0; color: ${BRAND_COLORS.bordeaux}; font-size: 18px;">💡 Insights</h2>
        <ul style="color: ${BRAND_COLORS.textDark}; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
          ${data.totalNewLeads > 0 ? `
            <li>${data.totalNewLeads > data.totalWon + data.totalClosedLost ? 'Follow up with open leads to improve conversion rates' : 'Great job closing leads this week!'}</li>
          ` : ''}
          ${data.overallConversionRate < 30 && data.totalWon + data.totalClosedLost > 0 ? `
            <li>Conversion rate is below 30% - consider reviewing response times and communication quality</li>
          ` : ''}
          ${data.fundSummaries.length > 0 && data.fundSummaries[0].newLeads > 0 ? `
            <li><strong>${data.fundSummaries[0].fundName}</strong> is your top performer with ${data.fundSummaries[0].newLeads} new leads</li>
          ` : ''}
          ${data.statusChangesCount === 0 ? `
            <li>No status updates this week - remind managers to keep lead statuses current</li>
          ` : ''}
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://funds.movingto.com/admin?tab=fund-managers" style="display: inline-block; background: ${BRAND_COLORS.bordeaux}; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 8px rgba(75, 15, 35, 0.25);">
          View Admin Dashboard
        </a>
      </div>
    </div>
    
    ${generateEmailFooter(DEAN_EMAIL)}
  `;
  
  const text = `
Weekly Lead Digest
${dateRange}

Overall Performance:
- New Leads: ${data.totalNewLeads}
- Conversions: ${data.totalWon}
- Closed Lost: ${data.totalClosedLost}
- Conversion Rate: ${data.overallConversionRate.toFixed(1)}%
- Status Changes: ${data.statusChangesCount}

Fund Performance:
${data.fundSummaries.map(fund => `
${fund.fundName}
- New Leads: ${fund.newLeads}
- Won: ${fund.wonLeads}
- Lost: ${fund.closedLostLeads}
- Conversion Rate: ${fund.conversionRate > 0 ? fund.conversionRate.toFixed(1) + '%' : '—'}
`).join('\n')}

View Admin Dashboard: https://funds.movingto.com/admin?tab=fund-managers

---
Moving To Global Pty Ltd
Melbourne, Victoria, Australia
  `;
  
  return { html, text };
}
