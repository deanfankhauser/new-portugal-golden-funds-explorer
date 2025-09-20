// Security utilities for Supabase Edge Functions
export interface SecurityConfig {
  allowedOrigins: string[];
  rateLimitRequests: number;
  rateLimitWindowMs: number;
}

// Production security configuration
const PRODUCTION_CONFIG: SecurityConfig = {
  allowedOrigins: [
    'https://funds.movingto.com',
    'https://develop.movingto.com'
  ],
  rateLimitRequests: 10,
  rateLimitWindowMs: 60000 // 1 minute
};

// Development configuration (more permissive)
const DEVELOPMENT_CONFIG: SecurityConfig = {
  allowedOrigins: ['*'], // Allow all in development
  rateLimitRequests: 100,
  rateLimitWindowMs: 60000
};

// Determine if we're in production
function isProduction(): boolean {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  return supabaseUrl.includes('bkmvydnfhmkjnuszroim.supabase.co');
}

// Get security configuration based on environment
export function getSecurityConfig(): SecurityConfig {
  return isProduction() ? PRODUCTION_CONFIG : DEVELOPMENT_CONFIG;
}

// Generate CORS headers based on request origin
export function getCorsHeaders(request: Request): Record<string, string> {
  const config = getSecurityConfig();
  const origin = request.headers.get('origin');
  
  // If wildcard is allowed (development), use it
  if (config.allowedOrigins.includes('*')) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };
  }
  
  // Production: check against allowed origins
  const allowedOrigin = origin && config.allowedOrigins.includes(origin) ? origin : config.allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };
}

// Simple in-memory rate limiter (for basic protection)
// Note: In production, consider using Redis or similar for distributed rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const config = getSecurityConfig();
  const now = Date.now();
  const key = identifier;
  
  // Clean up expired entries
  for (const [k, v] of rateLimitStore.entries()) {
    if (v.resetTime <= now) {
      rateLimitStore.delete(k);
    }
  }
  
  const entry = rateLimitStore.get(key);
  
  if (!entry) {
    // First request from this identifier
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.rateLimitWindowMs
    });
    return { allowed: true, remaining: config.rateLimitRequests - 1 };
  }
  
  if (entry.resetTime <= now) {
    // Window has expired, reset
    entry.count = 1;
    entry.resetTime = now + config.rateLimitWindowMs;
    return { allowed: true, remaining: config.rateLimitRequests - 1 };
  }
  
  if (entry.count >= config.rateLimitRequests) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0 };
  }
  
  // Increment count
  entry.count++;
  return { allowed: true, remaining: config.rateLimitRequests - entry.count };
}

// Get client identifier for rate limiting
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (Cloudflare, standard forwarded headers)
  const forwardedFor = request.headers.get('cf-connecting-ip') || 
                      request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  // Fallback to user agent + accept headers for basic fingerprinting
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const accept = request.headers.get('accept') || 'unknown';
  
  // Create a simple hash of the combination
  const identifier = `${userAgent}-${accept}`;
  return btoa(identifier).slice(0, 16); // Base64 encode and truncate
}

// Security middleware wrapper
export function withSecurity<T>(
  handler: (req: Request) => Promise<Response>
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    const corsHeaders = getCorsHeaders(req);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Rate limiting check
    const clientId = getClientIdentifier(req);
    const rateLimit = checkRateLimit(clientId);
    
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.'
        }),
        { 
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + 60)
          }
        }
      );
    }
    
    try {
      // Call the original handler
      const response = await handler(req);
      
      // Add rate limit headers to successful responses
      const headers = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
      headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    } catch (error) {
      console.error('Function error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
  };
}

// Input validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function sanitizeString(input: string, maxLength = 1000): string {
  return input.trim().slice(0, maxLength);
}

export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}