// Database configuration - Using VITE environment variables
export function getSupabaseConfig() {
  // Use VITE environment variables consistently
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // If environment variables are available, use them
  if (envUrl && envAnonKey) {
    const config = {
      url: envUrl,
      anonKey: envAnonKey
    };
    console.log(`🔌 Connected via VITE environment variables:`, config.url);
    return config;
  }
  
  // No fallback values - VITE environment variables are required
  throw new Error('❌ VITE environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) must be set in .env file');
}