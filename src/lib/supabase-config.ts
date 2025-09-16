import { getEnvironment } from './environment';

// Database configuration - Fixed for Lovable compatibility
export function getSupabaseConfig() {
  // Lovable does not support VITE_* environment variables
  // Always use the main Funds project configuration
  const config = {
    url: "https://bkmvydnfhmkjnuszroim.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZ5ZG5maG1ram51c3pyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.eXVPzUY_C8Qi_HGhzk-T6ovY1fqa3czPbxJmJc5ftG8"
  };
  
  console.log(`🔌 Connected to Funds database:`, config.url);
  return config;
}