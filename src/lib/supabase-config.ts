import { getEnvironment } from './environment';

// Database configurations for different environments
const SUPABASE_CONFIGS = {
  production: {
    url: "https://bkmvydnfhmkjnuszroim.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZ5ZG5maG1ram51c3pyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.eXVPzUY_C8Qi_HGhzk-T6ovY1fqa3czPbxJmJc5ftG8"
  },
  development: {
    // Replace with your actual development Supabase project credentials
    url: "https://YOUR_DEV_PROJECT_ID.supabase.co",
    anonKey: "YOUR_DEV_ANON_KEY"
  }
} as const;

export function getSupabaseConfig() {
  const environment = getEnvironment();
  const config = SUPABASE_CONFIGS[environment];
  
  if (environment === 'development' && 
      (config.url.includes('YOUR_DEV') || config.anonKey.includes('YOUR_DEV'))) {
    console.warn(`
🚨 Development Supabase credentials not configured!
Please:
1. Create a new Supabase project for development
2. Update src/lib/supabase-config.ts with your development credentials
3. Run the same migrations on your development database

Currently falling back to production database.
    `);
    return SUPABASE_CONFIGS.production;
  }
  
  console.log(`🔌 Connected to ${environment} database:`, config.url);
  return config;
}