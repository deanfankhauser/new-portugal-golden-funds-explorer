// Environment detection utility for automatic database switching
export type Environment = 'development' | 'production';

export function getEnvironment(): Environment {
  if (typeof window === 'undefined') {
    // Server-side rendering - default to production
    return 'production';
  }
  
  const hostname = window.location.hostname;
  
  // Production environment - explicit check first
  if (hostname === 'funds.movingto.com') {
    return 'production';
  }
  
  // Development/preview environments
  if (
    hostname === 'localhost' ||
    hostname.includes('lovable.dev') ||
    hostname.includes('vercel.app') ||
    hostname.includes('preview') ||
    hostname.includes('staging') ||
    hostname.includes('dev')
  ) {
    return 'development';
  }
  
  // Default to production for unknown domains
  return 'production';
}

export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

export function isProduction(): boolean {
  return getEnvironment() === 'production';
}