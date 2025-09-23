/**
 * Generates the appropriate email confirmation redirect URL based on the current domain
 */
export function getEmailRedirectUrl(): string {
  // Get the current domain
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  
  // For SSG builds, use a fallback
  if (!currentOrigin) {
    return 'https://funds.movingto.com/confirm';
  }
  
  // Handle different domains appropriately
  const hostname = new URL(currentOrigin).hostname;
  
  console.log('🔐 getEmailRedirectUrl - Current hostname:', hostname);
  console.log('🔐 getEmailRedirectUrl - Current origin:', currentOrigin);
  
  // Map specific domains to their appropriate redirect URLs
  const domainMappings: Record<string, string> = {
    'develop.com': 'https://develop.com/confirm',
    'funds.movingto.com': 'https://funds.movingto.com/confirm',
    'www.funds.movingto.com': 'https://funds.movingto.com/confirm', // Redirect www to non-www
    'localhost': `${currentOrigin}/confirm`,
    'preview': `${currentOrigin}/confirm` // For preview deployments
  };
  
  // Check for exact hostname matches first
  if (domainMappings[hostname]) {
    console.log('🔐 getEmailRedirectUrl - Using mapped URL:', domainMappings[hostname]);
    return domainMappings[hostname];
  }
  
  // Handle preview URLs (like lovable preview domains)
  if (hostname.includes('lovable') || hostname.includes('preview') || hostname.includes('netlify') || hostname.includes('vercel')) {
    const redirectUrl = `${currentOrigin}/confirm`;
    console.log('🔐 getEmailRedirectUrl - Using preview URL:', redirectUrl);
    return redirectUrl;
  }
  
  // Default fallback: use current origin
  const defaultUrl = `${currentOrigin}/confirm`;
  console.log('🔐 getEmailRedirectUrl - Using default URL:', defaultUrl);
  return defaultUrl;
}

/**
 * Gets the base domain without subdomain for redirect purposes
 */
export function getBaseDomain(): string {
  if (typeof window === 'undefined') {
    return 'funds.movingto.com';
  }
  
  const hostname = window.location.hostname;
  
  // Handle localhost and preview environments
  if (hostname === 'localhost' || hostname.includes('preview') || hostname.includes('lovable')) {
    return hostname;
  }
  
  // Extract main domain from subdomain (e.g., www.funds.movingto.com -> funds.movingto.com)
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts.slice(-2).join('.');
  }
  
  return hostname;
}