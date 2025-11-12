import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

/**
 * Build-time Supabase client for SSG and sitemap generation
 * Uses anon key for read-only access to public data
 */
export function getSupabaseBuildClient() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error(
      '❌ Missing Supabase environment variables for build process.\n' +
      '   Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY\n' +
      '   These must be set in your environment or .env file.'
    );
  }
  
  console.log(`🔌 Build: Connected to Supabase at ${url}`);
  
  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        'x-client-info': 'lovable-ssg-build'
      }
    }
  });
}
