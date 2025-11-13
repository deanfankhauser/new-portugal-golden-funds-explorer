import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation thresholds for performance metrics (in milliseconds)
const MAX_LCP = 60000;   // 60 seconds max - anything beyond likely a backgrounded tab
const MAX_FCP = 60000;   // 60 seconds max
const MAX_FID = 10000;   // 10 seconds max
const MAX_TTFB = 10000;  // 10 seconds max
const MAX_LOAD_TIME = 120000; // 2 minutes max

// Validate and sanitize metric values
const validateMetric = (value: number | null | undefined, max: number): number | null => {
  if (!value) return null;
  const rounded = Math.round(value);
  return rounded > 0 && rounded <= max ? rounded : null;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { type, data } = await req.json();

    console.log('Track performance metrics request:', { type, dataKeys: Object.keys(data) });

    if (type === 'performance') {
      const { error } = await supabase
        .from('page_performance_metrics')
        .insert({
          page_path: data.pagePath,
          page_type: data.pageType,
          lcp: validateMetric(data.lcp, MAX_LCP),
          fcp: validateMetric(data.fcp, MAX_FCP),
          cls: data.cls ? Math.round(data.cls * 1000) : null, // CLS is typically 0-1, scale to integer
          fid: validateMetric(data.fid, MAX_FID),
          ttfb: validateMetric(data.ttfb, MAX_TTFB),
          total_load_time: validateMetric(data.totalLoadTime, MAX_LOAD_TIME),
          session_id: data.sessionId,
          user_id: data.userId || null,
          user_agent: data.userAgent,
        });

      if (error) {
        console.error('Error inserting performance metrics:', error);
        throw error;
      }

      console.log('Performance metrics stored successfully');
    } else if (type === 'error') {
      const { error } = await supabase
        .from('page_errors')
        .insert({
          error_type: data.errorType,
          page_path: data.pagePath,
          error_message: data.errorMessage,
          referrer: data.referrer,
          user_agent: data.userAgent,
          session_id: data.sessionId,
          user_id: data.userId || null,
        });

      if (error) {
        console.error('Error inserting error log:', error);
        throw error;
      }

      console.log('Error log stored successfully');
    } else {
      throw new Error('Invalid type. Must be "performance" or "error"');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in track-performance-metrics:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
