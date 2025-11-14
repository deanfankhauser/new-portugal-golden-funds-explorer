// Environment-aware Supabase client
import { createClient } from '@supabase/supabase-js';
import type { DatabaseExtended } from './types-extended';;
import { getSupabaseConfig } from '../../lib/supabase-config';

// Get environment-specific configuration
const config = getSupabaseConfig();

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<DatabaseExtended>(config.url, config.anonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
  }
});