import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrackEventRequest {
  type: 'page_view' | 'comparison_add' | 'booking_click' | 'website_click' | 'save_fund';
  fund_id: string;
  session_id: string;
  referrer?: string;
  user_agent?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const data: TrackEventRequest = await req.json();
    console.log('Received tracking request:', { type: data.type, fund_id: data.fund_id, session_id: data.session_id });
    
    // Validate required fields
    if (!data.type || !data.fund_id || !data.session_id) {
      console.error('Missing required fields:', data);
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get auth user if available (optional)
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          userId = user.id;
          console.log('User authenticated:', userId);
        }
      } catch (authError) {
        console.warn('Auth error (non-critical):', authError);
        // Continue without user_id if auth fails
      }
    }

    // Insert based on event type with retry logic
    const maxRetries = 2;
    let attempt = 0;
    let lastError = null;

    while (attempt <= maxRetries) {
      try {
        if (data.type === 'page_view') {
          const { error, data: result } = await supabase
            .from('fund_page_views')
            .insert({
              fund_id: data.fund_id,
              session_id: data.session_id,
              user_id: userId,
              referrer: data.referrer || null,
              user_agent: data.user_agent || null,
            })
            .select();

          if (error) {
            throw error;
          }
          
          console.log('Page view tracked successfully');
          break;
        } else {
          const { error, data: result } = await supabase
            .from('fund_interactions')
            .insert({
              fund_id: data.fund_id,
              interaction_type: data.type,
              session_id: data.session_id,
              user_id: userId,
            })
            .select();

          if (error) {
            throw error;
          }
          
          console.log('Interaction tracked successfully');
          break;
        }
      } catch (err) {
        lastError = err;
        attempt++;
        
        if (attempt <= maxRetries) {
          console.warn(`Attempt ${attempt} failed, retrying...`, err);
          await new Promise(resolve => setTimeout(resolve, 100 * attempt));
        } else {
          console.error('All retry attempts failed:', err);
          // Log detailed error information
          console.error('Error details:', {
            message: err.message,
            code: err.code,
            details: err.details,
            hint: err.hint
          });
          
          return new Response(
            JSON.stringify({ 
              error: data.type === 'page_view' ? 'Failed to track page view' : 'Failed to track interaction',
              details: err.message 
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in track-fund-event:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
