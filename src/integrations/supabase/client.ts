// Environment-aware Supabase client
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getSupabaseConfig } from '../../lib/supabase-config';

// Detect if we're in SSR/SSG context
const isSSR = typeof window === 'undefined';

// Get environment-specific configuration
const config = getSupabaseConfig();

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(config.url, config.anonKey, {
  auth: {
    storage: !isSSR ? localStorage : undefined,
    persistSession: !isSSR,
    autoRefreshToken: !isSSR,
  },
  // In SSR, disable realtime features
  realtime: !isSSR ? undefined : {
    params: {
      eventsPerSecond: 0
    }
  }
});