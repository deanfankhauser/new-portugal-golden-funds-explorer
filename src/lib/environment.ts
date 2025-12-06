// Environment detection utility for automatic database switching
export type Environment = 'development' | 'production';

export function getEnvironment(): Environment {
  if (typeof window === 'undefined') {
    // Server-side rendering - default to production
    return 'production';
  }
  
  const hostname = window.location.hostname;
  
  // Development/preview environments
  if (
    hostname === 'localhost' ||
    hostname.includes('vercel.app') ||
    hostname.includes('preview') ||
    hostname.includes('staging') ||
    hostname.includes('dev')
  ) {
    return 'development';
  }
  
  // Production environment
  return 'production';
}

export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

export function isProduction(): boolean {
  return getEnvironment() === 'production';
}