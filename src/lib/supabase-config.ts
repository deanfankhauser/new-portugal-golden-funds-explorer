import { getEnvironment } from './environment';

// Database configurations using environment variables
export function getSupabaseConfig() {
  const environment = getEnvironment();
  
  // Try to get config from environment variables first
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const envDevUrl = import.meta.env.VITE_DEV_SUPABASE_URL;
  const envDevAnonKey = import.meta.env.VITE_DEV_SUPABASE_ANON_KEY;
  
  // Fallback configurations
  const SUPABASE_CONFIGS = {
    production: {
      url: envUrl || "https://bkmvydnfhmkjnuszroim.supabase.co",
      anonKey: envAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZ5ZG5maG1ram51c3pyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.eXVPzUY_C8Qi_HGhzk-T6ovY1fqa3czPbxJmJc5ftG8"
    },
    development: {
      url: envDevUrl || "https://fgwmkjivosjvvslbrvxe.supabase.co",
      anonKey: envDevAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnd21raml2b3NqdnZzbGJydnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwODAzOTksImV4cCI6MjA3MjY1NjM5OX0.uW9fZu-S4wna3miDpXIUuK4nOgxRIXD7YjpV-jGpl-A"
    }
  } as const;

  const config = SUPABASE_CONFIGS[environment];
  
  console.log(`🔌 Connected to ${environment} database:`, config.url);
  return config;
}