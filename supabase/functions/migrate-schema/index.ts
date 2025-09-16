import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Note: This edge function has been deprecated and no longer performs schema introspection
    // or cross-project migrations. Using raw SQL via RPC like `execute_sql` is not supported.
    // Use Supabase migrations for schema changes and the dedicated data copy functions for data.

    const info = {
      deprecated: true,
      message:
        'migrate-schema is now a no-op. Use Supabase migrations for schema changes. For data copy, call setup-develop-schema or copy-to-develop.',
      alternatives: {
        schema: 'Use the Supabase migration tool in your main project',
        dataCopy: ['setup-develop-schema', 'copy-to-develop'],
      },
    };

    // Basic sanity check that envs exist (logs help debugging), but do not attempt any DB calls
    const hasProd = Boolean(Deno.env.get('SUPABASE_URL') && Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
    const hasDev = Boolean(Deno.env.get('FUNDS_DEV_SUPABASE_URL') && Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY'));
    console.log('migrate-schema invoked', { hasProd, hasDev });

    return new Response(
      JSON.stringify({ success: true, ...info }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('migrate-schema error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
