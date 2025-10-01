// Environment-aware Supabase client
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getSupabaseConfig } from '../../lib/supabase-config';

// Get environment-specific configuration
const config = getSupabaseConfig();

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(config.url, config.anonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
  }
});