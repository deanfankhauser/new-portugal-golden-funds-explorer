// Database configuration - Environment-aware Supabase client
export function getSupabaseConfig() {
  // Check for development build environment flag
  const isDevelopmentBuild = import.meta.env.VITE_BUILD_ENV === 'development';
  
  // For development builds, use development Supabase project
  if (isDevelopmentBuild) {
    // Use development project from secrets
    const config = {
      url: 'https://ejlrhokqjddvypsoxuqr.supabase.co', // FUNDS_DEV_SUPABASE_URL
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbHJob2txamRkdnlwc294dXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.6-F8L_eKRqBNJ9q8o7d5Yeo8lJt23C5GHOgVXRg-6Vs' // FUNDS_DEV_SUPABASE_ANON_KEY
    };
    console.log(`🔧 Development build detected - using development database:`, config.url);
    return config;
  }
  
  // Use VITE environment variables for production
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // If environment variables are available, use them
  if (envUrl && envAnonKey) {
    const config = {
      url: envUrl,
      anonKey: envAnonKey
    };
    console.log(`🔌 Production build - using production database:`, config.url);
    return config;
  }
  
  // No fallback values - VITE environment variables are required
  throw new Error('❌ VITE environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) must be set in .env file');
}