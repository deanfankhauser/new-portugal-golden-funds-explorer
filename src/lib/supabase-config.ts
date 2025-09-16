import { getEnvironment } from './environment';

// Database configuration using environment variables
export function getSupabaseConfig() {
  const environment = getEnvironment();
  
  // Use environment variables that change based on deployment environment
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // Fallback configurations for Lovable preview
  const fallbackConfig = {
    production: {
      url: "https://bkmvydnfhmkjnuszroim.supabase.co",
      anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZ5ZG5maG1ram51c3pyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.eXVPzUY_C8Qi_HGhzk-T6ovY1fqa3czPbxJmJc5ftG8"
    },
    development: {
      url: "https://fgwmkjivosjvvslbrvxe.supabase.co",
      anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnd21raml2b3NqdnZzbGJydnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwODAzOTksImV4cCI6MjA3MjY1NjM5OX0.uW9fZu-S4wna3miDpXIUuK4nOgxRIXD7YjpV-jGpl-A"
    }
  };
  
  const config = {
    url: url || fallbackConfig[environment].url,
    anonKey: anonKey || fallbackConfig[environment].anonKey
  };
  
  console.log(`🔌 Connected to ${environment} database:`, config.url);
  return config;
}