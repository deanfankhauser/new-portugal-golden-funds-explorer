
import postmark from 'postmark';

// Utility function for safe error logging
const logError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const errorId = Math.random().toString(36).substring(2, 15);
  
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
const MAX_REQUESTS_PER_WINDOW = 5;

// Input validation function
const validateInput = (email, userName) => {
  // Email validation (enhanced)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.length > 254 || !emailRegex.test(email)) {
    return 'Invalid email format';
  }
  
  // Name validation (if provided)
  if (userName && (typeof userName !== 'string' || userName.length > 100)) {
    return 'Invalid name format';
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
  
  // Enhanced CORS with multiple domains for flexibility
  const allowedOrigins = [
    'https://funds.movingto.com',
    'https://movingto.com',
    'http://localhost:5173',
    'https://preview.lovable.dev'
  ];
  
  // Allow Vercel preview deployments
  const origin = req.headers.origin;
  const isVercelPreview = origin && origin.includes('.vercel.app');
  
  if (allowedOrigins.includes(origin) || isVercelPreview) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');

  // Production API key requirement - soften for same-origin requests
  if (process.env.NODE_ENV === 'production') {
    const isSameOrigin = !req.headers.origin || 
      req.headers.origin === 'https://funds.movingto.com' || 
      req.headers.origin === 'https://movingto.com';
    
    if (!isSameOrigin) {
      const apiKey = req.headers['x-api-key'];
      if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
        return res.status(401).json(createSafeErrorResponse('Unauthorized access', 'AUTH_001'));
      }
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
    const { email, userName } = req.body;

    // Validate input
    const validationError = validateInput(email, userName);
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

    // Send email using template
    const result = await client.sendEmailWithTemplate({
      From: 'dean@movingto.com',
      To: email,
      TemplateAlias: 'code-your-own-2',
      TemplateModel: {
        name: userName || 'Investor',
        email: email
      },
      MessageStream: 'outbound'
    });

    // Log successful email send (without sensitive data)
    console.log(`Thank you email sent successfully to ${email.substring(0, 3)}***@${email.split('@')[1]} | MessageID: ${result.MessageID}`);

    return res.status(200).json({ 
      success: true, 
      messageId: result.MessageID,
      message: 'Thank you email sent successfully' 
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
