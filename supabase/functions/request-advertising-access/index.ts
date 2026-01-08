import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  fundId: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fundId, userId }: RequestBody = await req.json();

    if (!fundId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: fundId and userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch fund details
    const { data: fund, error: fundError } = await supabase
      .from('funds')
      .select('*')
      .eq('id', fundId)
      .single();

    if (fundError || !fund) {
      console.error('Error fetching fund:', fundError);
      return new Response(
        JSON.stringify({ error: 'Fund not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch manager profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('manager_name, company_name, email, phone')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Manager profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format currency
    const formatCurrency = (amount: number | null) => {
      if (!amount) return 'N/A';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'UTC',
    });

    // Generate HTML email
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Advertising Access Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #EDEAE6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #EDEAE6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4B0F23 0%, #6B1532 100%); padding: 40px; text-align: center;">
              <div style="background-color: rgba(255,255,255,0.15); width: 64px; height: 64px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="font-size: 32px;">📢</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.02em;">New Advertising Request</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 16px;">A fund manager has requested early access to advertising features</p>
            </td>
          </tr>

          <!-- Manager Information -->
          <tr>
            <td style="padding: 40px;">
              <div style="background: linear-gradient(135deg, #4B0F23 0%, #6B1532 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Manager Details</h2>
              </div>
              <div style="background-color: #EDEAE6; border: 1px solid rgba(75, 15, 35, 0.15); border-radius: 12px; padding: 24px;">
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #666; font-size: 14px; padding-bottom: 8px;">Manager Name:</td>
                    <td style="color: #1a1a1a; font-size: 15px; font-weight: 600; text-align: right; padding-bottom: 8px;">${profile.manager_name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px; padding-bottom: 8px;">Company:</td>
                    <td style="color: #1a1a1a; font-size: 15px; font-weight: 600; text-align: right; padding-bottom: 8px;">${profile.company_name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px; padding-bottom: 8px;">Email:</td>
                    <td style="color: #4B0F23; font-size: 15px; font-weight: 600; text-align: right; padding-bottom: 8px;">${profile.email}</td>
                  </tr>
                  ${profile.phone ? `
                  <tr>
                    <td style="color: #666; font-size: 14px;">Phone:</td>
                    <td style="color: #1a1a1a; font-size: 15px; font-weight: 600; text-align: right;">${profile.phone}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
            </td>
          </tr>

          <!-- Fund Information -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <div style="background: linear-gradient(135deg, #4B0F23 0%, #6B1532 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Fund Details</h2>
              </div>
              <div style="background-color: #EDEAE6; border: 1px solid rgba(75, 15, 35, 0.15); border-radius: 12px; padding: 24px;">
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #666; font-size: 14px; padding-bottom: 8px;">Fund Name:</td>
                    <td style="color: #1a1a1a; font-size: 15px; font-weight: 600; text-align: right; padding-bottom: 8px;">${fund.name}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px; padding-bottom: 8px;">Fund ID:</td>
                    <td style="color: #1a1a1a; font-size: 15px; font-weight: 600; text-align: right; padding-bottom: 8px;">${fund.id}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px; padding-bottom: 8px;">Category:</td>
                    <td style="color: #1a1a1a; font-size: 15px; font-weight: 600; text-align: right; padding-bottom: 8px;">${fund.category || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px; padding-bottom: 8px;">Min Investment:</td>
                    <td style="color: #1a1a1a; font-size: 15px; font-weight: 600; text-align: right; padding-bottom: 8px;">${formatCurrency(fund.minimum_investment)}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px; padding-bottom: 8px;">Fund Size (AUM):</td>
                    <td style="color: #1a1a1a; font-size: 15px; font-weight: 600; text-align: right; padding-bottom: 8px;">${formatCurrency(fund.aum)}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 14px;">Target Return:</td>
                    <td style="color: #22c55e; font-size: 15px; font-weight: 600; text-align: right;">${fund.expected_return_max ? `${fund.expected_return_max}% p.a.` : 'N/A'}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Timestamp -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <div style="background-color: rgba(75, 15, 35, 0.05); border-radius: 8px; padding: 16px; text-align: center;">
                <p style="margin: 0; color: #666; font-size: 14px;">Request submitted at: <strong>${timestamp}</strong></p>
              </div>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <a href="https://funds.movingto.com/manage-fund/${fundId}" style="display: inline-block; background: linear-gradient(135deg, #4B0F23 0%, #6B1532 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(75, 15, 35, 0.3);">
                View Fund Dashboard
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f8f8; padding: 32px 40px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">Moving To Global Pty Ltd</p>
              <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.6;">
                Melbourne, Victoria<br>
                Australia
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Generate plain text email
    const textBody = `
New Advertising Access Request

Hello Dean,

A fund manager has requested early access to advertising features.

MANAGER DETAILS:
- Name: ${profile.manager_name || 'N/A'}
- Company: ${profile.company_name || 'N/A'}
- Email: ${profile.email}
${profile.phone ? `- Phone: ${profile.phone}` : ''}

FUND DETAILS:
- Fund Name: ${fund.name}
- Fund ID: ${fund.id}
- Category: ${fund.category || 'N/A'}
- Min Investment: ${formatCurrency(fund.minimum_investment)}
- Fund Size: ${formatCurrency(fund.aum)}
- Target Return: ${fund.expected_return_max ? `${fund.expected_return_max}% p.a.` : 'N/A'}

Request submitted at: ${timestamp}

View Fund Dashboard: https://funds.movingto.com/manage-fund/${fundId}

---
Moving To Global Pty Ltd
Melbourne, Victoria, Australia
    `;

    // Send email via Postmark
    const postmarkApiKey = Deno.env.get('POSTMARK_SERVER_TOKEN');
    if (!postmarkApiKey) {
      throw new Error('POSTMARK_SERVER_TOKEN not configured');
    }

    const emailResponse = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': postmarkApiKey,
      },
      body: JSON.stringify({
        From: 'noreply@movingto.com',
        To: 'dean@movingto.com',
        Subject: `📢 Advertising Access Request for ${fund.name}`,
        HtmlBody: htmlBody,
        TextBody: textBody,
        MessageStream: 'outbound',
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Postmark error:', errorText);
      throw new Error('Failed to send email via Postmark');
    }

    const emailResult = await emailResponse.json();
    console.log('Email sent successfully:', emailResult);

    return new Response(
      JSON.stringify({ success: true, message: 'Access request sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in request-advertising-access function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
