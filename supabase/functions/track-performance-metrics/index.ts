import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
          lcp: data.lcp ? Math.round(data.lcp) : null,
          fcp: data.fcp ? Math.round(data.fcp) : null,
          cls: data.cls ? Math.round(data.cls * 1000) : null, // CLS is typically 0-1, scale to integer
          fid: data.fid ? Math.round(data.fid) : null,
          ttfb: data.ttfb ? Math.round(data.ttfb) : null,
          total_load_time: data.totalLoadTime ? Math.round(data.totalLoadTime) : null,
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
