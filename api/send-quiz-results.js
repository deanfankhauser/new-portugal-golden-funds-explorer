
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
    const errorId = logError(new Error('Method not allowed'), 'Invalid HTTP method');
    return res.status(405).json(createSafeErrorResponse('Method not allowed', errorId));
  }

  try {
    const { email, recommendations, quizAnswers, timestamp } = req.body;

    // Validate required data
    if (!email || !recommendations) {
      const errorId = logError(new Error('Missing required data'), 'Request validation');
      return res.status(400).json(createSafeErrorResponse('Missing required data', errorId));
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorId = logError(new Error('Invalid email format'), 'Email validation');
      return res.status(400).json(createSafeErrorResponse('Invalid email format', errorId));
    }

    // Check for API token
    if (!process.env.POSTMARK_API_TOKEN) {
      const errorId = logError(new Error('POSTMARK_API_TOKEN not configured'), 'Environment configuration');
      return res.status(500).json(createSafeErrorResponse('Email service configuration error', errorId));
    }

    // Initialize Postmark client
    const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

    // Prepare template data for the top 3 recommendations
    const topRecommendations = recommendations.slice(0, 3).map(fund => ({
      name: fund.name,
      description: fund.description,
      minimumInvestment: fund.minimumInvestment.toLocaleString(),
      returnTarget: fund.returnTarget,
      term: fund.term,
      managerName: fund.managerName,
      score: Math.round(fund.score)
    }));

    // Send email using Postmark template
    const result = await client.sendEmailWithTemplate({
      From: 'dean@movingto.com',
      To: email,
      TemplateAlias: 'fund-quiz-results', // You'll need to create this template in Postmark
      TemplateModel: {
        recommendations: topRecommendations,
        totalMatches: recommendations.length,
        userProfile: {
          riskAppetite: quizAnswers?.riskAppetite || 'Not specified',
          investmentHorizon: quizAnswers?.investmentHorizon || 'Not specified',
          ticketSize: quizAnswers?.ticketSize || 'Not specified',
          citizenship: quizAnswers?.citizenship || 'Not specified'
        },
        timestamp: new Date(timestamp).toLocaleDateString()
      },
      MessageStream: 'outbound'
    });

    // Log successful email send (without sensitive data)
    console.log(`Quiz results email sent successfully to ${email.substring(0, 3)}***@${email.split('@')[1]} | MessageID: ${result.MessageID}`);

    return res.status(200).json({ 
      success: true, 
      messageId: result.MessageID,
      message: 'Fund recommendations email sent successfully' 
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
