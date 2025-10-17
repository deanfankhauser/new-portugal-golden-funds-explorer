/**
 * SSR-safe environment variable access
 * Prioritizes process.env (Node/SSG) over import.meta.env (Vite/browser)
 */

const isSSR = typeof process !== 'undefined' && process.env;
const isBrowser = typeof window !== 'undefined';

export const getEnv = (key: string): string | undefined => {
  // 1. Try process.env (SSG/Node)
  if (isSSR && process.env[key]) {
    return process.env[key];
  }
  
  // 2. Try import.meta.env (Vite/browser) - safe check
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta?.env?.[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch {
    // import.meta not available in this context
  }
  
  return undefined;
};

export const getBaseUrl = (): string => {
  return (
    getEnv('VITE_APP_BASE_URL') ||
    getEnv('APP_BASE_URL') ||
    getEnv('NEXT_PUBLIC_APP_BASE_URL') ||
    (isBrowser ? window.location.origin : 'https://funds.movingto.com')
  );
};

export const getSupabaseUrl = (): string => {
  return (
    getEnv('VITE_SUPABASE_URL') ||
    getEnv('SUPABASE_URL') ||
    'https://bkmvydnfhmkjnuszroim.supabase.co'
  );
};

export const getSupabaseAnonKey = (): string => {
  return (
    getEnv('VITE_SUPABASE_ANON_KEY') ||
    getEnv('SUPABASE_ANON_KEY') ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZ5ZG5maG1ram51c3pyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.eXVPzUY_C8Qi_HGhzk-T6ovY1fqa3czPbxJmJc5ftG8'
  );
};

export const isDev = (): boolean => {
  if (isSSR) {
    return process.env.NODE_ENV === 'development';
  }
  try {
    // @ts-ignore
    return import.meta?.env?.DEV === true;
  } catch {
    return false;
  }
};

// Log environment snapshot for SSG debugging
export const logEnvSnapshot = () => {
  if (!isSSR) return;
  
  console.log('\n🔐 SSG Environment Snapshot:');
  console.log('  NODE_ENV:', process.env.NODE_ENV);
  console.log('  SSG_DEBUG:', process.env.SSG_DEBUG);
  console.log('  VITE_APP_BASE_URL:', process.env.VITE_APP_BASE_URL ? `${process.env.VITE_APP_BASE_URL.substring(0, 30)}...` : 'NOT SET');
  console.log('  APP_BASE_URL:', process.env.APP_BASE_URL ? `${process.env.APP_BASE_URL.substring(0, 30)}...` : 'NOT SET');
  console.log('  VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? `${process.env.VITE_SUPABASE_URL.substring(0, 40)}...` : 'NOT SET');
  console.log('  SUPABASE_URL:', process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL.substring(0, 40)}...` : 'NOT SET');
  console.log('  VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? `${process.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT SET');
  console.log('  SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? `${process.env.SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT SET');
  console.log('');
};
