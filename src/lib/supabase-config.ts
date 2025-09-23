// Environment-aware Supabase configuration
export function getSupabaseConfig() {
  // Check hostname to determine environment
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  // If this is the develop environment (funds_develop)
  if (hostname.includes('develop.movingto.com') || hostname.includes('funds-develop')) {
    const config = {
      url: 'https://iedddpjxonqddvbfrtnm.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllZGRkcGp4b25xZGR2YmZydG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcwODg3MTYsImV4cCI6MjA0MjY2NDcxNn0.YhCpWKzG52ZU7LmQfnFZEeEbE0DApS3hAn5L0Zj9n0I'
    };
    console.log(`🔌 Connected to funds_develop environment:`, config.url);
    return config;
  }
  
  // Default to production environment
  const config = {
    url: 'https://bkmvydnfhmkjnuszroim.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZ5ZG5maG1ram51c3pyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.eXVPzUY_C8Qi_HGhzk-T6ovY1fqa3czPbxJmJc5ftG8'
  };
  console.log(`🔌 Connected to production environment:`, config.url);
  return config;
}