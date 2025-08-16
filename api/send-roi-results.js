
import postmark from 'postmark';

// Utility function for safe error logging
const logError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const errorId = Math.random().toString(36).substring(2, 15);
  
  // Log full error details server-side (visible in Vercel logs)
  console.error(`[${timestamp}] Error ID: ${errorId} | Context: ${context}`);
  console.error('Full error:', error);
  
  return errorId;
};

// Utility function to sanitize error responses
const createSafeErrorResponse = (message, errorId) => ({
  error: message,
  errorId: errorId,
  timestamp: new Date().toISOString()
});

// Simple rate limiting store (in-memory)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

// Input validation function
const validateInput = (email, results) => {
  // Email validation (enhanced)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.length > 254 || !emailRegex.test(email)) {
    return 'Invalid email format';
  }
  
  // Results validation
  if (!results || typeof results !== 'object') {
    return 'Invalid results data';
  }
  
  // Validate required numeric fields
  const requiredFields = ['totalValue', 'totalReturn', 'annualizedReturn'];
  for (const field of requiredFields) {
    if (typeof results[field] !== 'number' || isNaN(results[field])) {
      return 'Invalid calculation results';
    }
  }
  
  return null;
};

// Rate limiting function
const checkRateLimit = (ip) => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Clean old entries
  for (const [key, data] of requestCounts.entries()) {
    if (data.timestamp < windowStart) {
      requestCounts.delete(key);
    }
  }
  
  const current = requestCounts.get(ip) || { count: 0, timestamp: now };
  if (current.timestamp < windowStart) {
    current.count = 1;
    current.timestamp = now;
  } else {
    current.count++;
  }
  
  requestCounts.set(ip, current);
  return current.count <= MAX_REQUESTS_PER_WINDOW;
};

export default async function handler(req, res) {
  // Get client IP for rate limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  
  // Set restrictive CORS headers with strict hostname validation
  const allowedOrigins = [
    'https://funds.movingto.com',
    'https://fundsportugal.com'
  ];
  
  // Add Vercel preview URLs only in development
  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('https://vercel.app');
  }
  
  const origin = req.headers.origin;
  const isValidOrigin = allowedOrigins.some(allowed => origin === allowed);
  
  if (isValidOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');

  // Require API key in production
  if (process.env.NODE_ENV === 'production' && req.method === 'POST') {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
      const errorId = logError(new Error('Invalid API key'), 'Authentication');
      return res.status(401).json(createSafeErrorResponse('Unauthorized', errorId));
    }
  }

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    const errorId = logError(new Error('Method not allowed'), 'Invalid HTTP method');
    return res.status(405).json(createSafeErrorResponse('Method not allowed', errorId));
  }

  // Rate limiting check
  if (!checkRateLimit(ip)) {
    const errorId = logError(new Error('Rate limit exceeded'), 'Rate limiting');
    return res.status(429).json(createSafeErrorResponse('Too many requests. Please try again later.', errorId));
  }

  try {
    const { email, results, selectedFund, timestamp } = req.body;

    // Validate input
    const validationError = validateInput(email, results);
    if (validationError) {
      const errorId = logError(new Error(validationError), 'Input validation');
      return res.status(400).json(createSafeErrorResponse(validationError, errorId));
    }

    // Check for API token
    if (!process.env.POSTMARK_API_TOKEN) {
      const errorId = logError(new Error('POSTMARK_API_TOKEN not configured'), 'Environment configuration');
      return res.status(500).json(createSafeErrorResponse('Email service configuration error', errorId));
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

    // Log successful email send (without sensitive data)
    console.log(`Email sent successfully to ${email.substring(0, 3)}***@${email.split('@')[1]} | MessageID: ${result.MessageID}`);

    return res.status(200).json({ 
      success: true, 
      messageId: result.MessageID,
      message: 'ROI calculation email sent successfully' 
    });

  } catch (error) {
    const errorId = logError(error, 'Email sending process');
    
    // Handle specific Postmark errors
    if (error.name === 'PostmarkError') {
      return res.status(400).json(createSafeErrorResponse('Email service error', errorId));
    }
    
    return res.status(500).json(createSafeErrorResponse('Internal server error', errorId));
  }
}
