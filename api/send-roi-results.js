
const postmark = require('postmark');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, results, selectedFund, timestamp } = req.body;

    // Validate required data
    if (!email || !results) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    // Initialize Postmark client
    const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

    // Format the email content
    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Your Portugal Golden Visa ROI Calculation</h2>
          <p>Thank you for using our ROI Calculator. Here are your investment projections:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">Investment Results</h3>
            <p><strong>Total Investment Value:</strong> €${results.totalValue.toLocaleString()}</p>
            <p><strong>Total Return:</strong> €${results.totalReturn.toLocaleString()}</p>
            <p><strong>Annualized Return:</strong> ${results.annualizedReturn.toFixed(2)}%</p>
            ${selectedFund ? `<p><strong>Selected Fund:</strong> ${selectedFund.name}</p>` : ''}
          </div>
          
          <p style="color: #666; font-size: 14px;">
            These projections are estimates based on historical data and market assumptions. 
            Actual returns may vary. Please consult with a financial advisor for personalized advice.
          </p>
          
          <p>Best regards,<br>Portugal Golden Visa Investment Team</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            This email was generated on ${new Date(timestamp).toLocaleString()}
          </p>
        </body>
      </html>
    `;

    const emailText = `
Your Portugal Golden Visa ROI Calculation

Thank you for using our ROI Calculator. Here are your investment projections:

Investment Results:
- Total Investment Value: €${results.totalValue.toLocaleString()}
- Total Return: €${results.totalReturn.toLocaleString()}
- Annualized Return: ${results.annualizedReturn.toFixed(2)}%
${selectedFund ? `- Selected Fund: ${selectedFund.name}` : ''}

These projections are estimates based on historical data and market assumptions. 
Actual returns may vary. Please consult with a financial advisor for personalized advice.

Best regards,
Portugal Golden Visa Investment Team

This email was generated on ${new Date(timestamp).toLocaleString()}
    `;

    // Send email via Postmark
    const result = await client.sendEmail({
      From: 'dean@movingto.com',
      To: email,
      Subject: 'Your Portugal Golden Visa ROI Calculation Results',
      HtmlBody: emailHtml,
      TextBody: emailText,
      MessageStream: 'outbound'
    });

    console.log('Email sent successfully:', result);

    return res.status(200).json({ 
      success: true, 
      messageId: result.MessageID,
      message: 'ROI calculation email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Handle specific Postmark errors
    if (error.name === 'PostmarkError') {
      return res.status(400).json({ 
        error: 'Email service error', 
        details: error.message 
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
