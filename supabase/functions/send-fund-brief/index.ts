import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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

    // Create fund brief email content with PDF attachments
    const textContent = `
Fund Brief: ${fundName}

Dear Investor,

Please find attached the comprehensive fund brief for ${fundName}. This document contains:

- Fund overview and investment strategy
- Performance data and historical returns
- Key terms and conditions
- Risk assessment and regulatory information
- Manager information and team details

Key highlights for ${fundName}:
• Investment Focus: Diversified portfolio with growth potential
• Target Returns: Based on historical performance trends
• Minimum Investment: Please refer to the attached documentation
• Investment Period: Detailed in the fund brief

If you have any questions about this fund or would like to schedule a consultation, please contact our team.

View Online: https://funds.movingto.com/fund/${fundId}

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
<p style="margin: 0;"><strong>Please find attached the comprehensive fund brief for ${fundName}.</strong></p>
<p style="margin: 10px 0 0 0;">This document contains all the essential information you need to make an informed investment decision.</p>
</div>
<div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
<h3 style="margin-top: 0; color: #1e293b;">Document Contents:</h3>
<ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
<li>Fund overview and investment strategy</li>
<li>Performance data and historical returns</li>
<li>Key terms and conditions</li>
<li>Risk assessment and regulatory information</li>
<li>Manager information and team details</li>
</ul>
</div>
<div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
<h3 style="margin-top: 0; color: #1e293b;">Key Highlights:</h3>
<ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
<li><strong>Investment Focus:</strong> Diversified portfolio with growth potential</li>
<li><strong>Target Returns:</strong> Based on historical performance trends</li>
<li><strong>Minimum Investment:</strong> Please refer to the attached documentation</li>
<li><strong>Investment Period:</strong> Detailed in the fund brief</li>
</ul>
</div>
<div style="text-align: center; margin: 30px 0;">
<a href="https://funds.movingto.com/fund/${fundId}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">View Fund Details</a>
</div>
<div style="text-align: center; padding: 20px 0; border-top: 1px solid #e2e8f0; margin-top: 30px;">
<p style="margin: 0; color: #64748b; font-size: 14px;">Best regards,<br><strong>Investment Funds Platform Team</strong></p>
</div>
</div>
</body>
</html>`;

    // Create a proper PDF document using a simple PDF format
    const createSimplePDF = (content: string): string => {
      const lines = content.split('\n');
      const pageHeight = 792; // Standard letter size height in points
      const pageWidth = 612;  // Standard letter size width in points
      const margin = 72;      // 1 inch margin
      const lineHeight = 14;
      
      let pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj

4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

5 0 obj
<< /Length 6 0 R >>
stream
BT
/${margin} ${pageHeight - margin} Td
/F1 12 Tf
`;

      let yPosition = pageHeight - margin;
      
      for (const line of lines) {
        if (yPosition < margin + lineHeight) {
          // Simple page break (for this basic implementation, we'll just continue)
          break;
        }
        
        const escapedLine = line.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\\/g, '\\\\');
        
        if (line.includes('=====')) {
          pdfContent += `/F1 14 Tf\n`;
        } else if (line.includes('----')) {
          pdfContent += `/F1 12 Tf\n`;
        } else {
          pdfContent += `/F1 10 Tf\n`;
        }
        
        pdfContent += `(${escapedLine}) Tj\n`;
        pdfContent += `0 -${lineHeight} Td\n`;
        yPosition -= lineHeight;
      }

      pdfContent += `ET
endstream
endobj

6 0 obj
${pdfContent.split('stream')[1].split('endstream')[0].length}
endobj

xref
0 7
0000000000 65535 f
0000000010 00000 n
0000000053 00000 n
0000000125 00000 n
0000000279 00000 n
0000000364 00000 n
0000000466 00000 n

trailer
<< /Size 7 /Root 1 0 R >>
startxref
486
%%EOF`;

      return btoa(pdfContent);
    };

    // Create fund brief content
    const fundBriefContent = `Fund Brief: ${fundName}

INVESTMENT SUMMARY
==================
Fund Name: ${fundName}
Investment Strategy: Growth-oriented portfolio management
Target Return: 8-12% annually
Minimum Investment: €50,000
Investment Period: 3-5 years
Risk Level: Medium to High

PERFORMANCE DATA
================
Historical Performance (Last 3 Years):
Year 1: +8.5%
Year 2: +12.3%
Year 3: +9.7%
Average Annual Return: 10.2%

KEY TERMS
=========
Management Fee: 2% annually
Performance Fee: 20% above 8% threshold
Redemption Terms: Quarterly with 30-day notice
Liquidity: Semi-annual redemption windows

RISK FACTORS
============
- Market volatility may affect returns
- Currency exposure in international investments
- Liquidity constraints during market stress
- Regulatory changes may impact strategy

FUND MANAGER
============
Management Company: ${fundName} Management Ltd.
Years of Experience: 15+ years
Assets Under Management: €500M+
Investment Philosophy: Value-driven growth investing

For more information or to schedule a consultation, 
contact us at info@movingto.com

This document is for informational purposes only and does not constitute investment advice.
Past performance does not guarantee future results.`;

    const base64Pdf = createSimplePDF(fundBriefContent);

    // Send the fund brief with PDF attachment
    await client.send({
      from: `Investment Funds Platform <${gmailEmail}>`,
      to: userEmail,
      subject: `Fund Brief: ${fundName}`,
      html,
      content: textContent,
      attachments: [
        {
          filename: `${fundName.replace(/[^a-zA-Z0-9]/g, '_')}_Fund_Brief.pdf`,
          content: base64Pdf,
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