import { getEnvironment } from './environment';

// Database configuration - Environment-aware
export function getSupabaseConfig() {
  // Try to read from environment variables first (for Vercel deployments)
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // If environment variables are available, use them
  if (envUrl && envAnonKey) {
    const config = {
      url: envUrl,
      anonKey: envAnonKey
    };
    console.log(`🔌 Connected via environment variables:`, config.url);
    return config;
  }
  
  // Fall back to hardcoded production values
  const config = {
    url: "https://bkmvydnfhmkjnuszroim.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZ5ZG5maG1ram51c3pyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.eXVPzUY_C8Qi_HGhzk-T6ovY1fqa3czPbxJmJc5ftG8"
  };
  
  console.log(`🔌 Connected to Funds database:`, config.url);
  return config;
}