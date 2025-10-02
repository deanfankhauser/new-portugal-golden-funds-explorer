import { getSupabaseUrl, getSupabaseAnonKey } from './ssr-env';

// Database configuration - SSR-safe for both Vite (browser) and Node.js (SSG)
export function getSupabaseConfig() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (url && anonKey) {
    const config = { url, anonKey };
    console.log(`🔌 Connected to Supabase:`, config.url);
    return config;
  }

  throw new Error('❌ Supabase environment variables not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables.');
}