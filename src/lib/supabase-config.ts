// Database configuration - SSR-safe for both Vite (browser) and Node.js (SSG)
export function getSupabaseConfig() {
  // Helper to safely get from process.env (Node.js/SSG context)
  const fromProcess = (key: string) => {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
    return undefined;
  };

  // Helper to safely get from import.meta.env (Vite/browser context)
  const fromVite = (key: string) => {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env[key];
    }
    return undefined;
  };

  // Try multiple environment variable sources (process.env for SSG, import.meta.env for browser)
  const url =
    fromProcess('VITE_SUPABASE_URL') ||
    fromProcess('SUPABASE_URL') ||
    fromVite('VITE_SUPABASE_URL');

  const anonKey =
    fromProcess('VITE_SUPABASE_ANON_KEY') ||
    fromProcess('SUPABASE_ANON_KEY') ||
    fromVite('VITE_SUPABASE_ANON_KEY');

  if (url && anonKey) {
    const config = { url, anonKey };
    console.log(`🔌 Connected to Supabase:`, config.url);
    return config;
  }

  throw new Error('❌ Supabase environment variables not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables.');
}