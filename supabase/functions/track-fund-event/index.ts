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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const data: TrackEventRequest = await req.json();
    
    // Validate required fields
    if (!data.type || !data.fund_id || !data.session_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get auth user if available (optional)
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
      }
    }

    // Insert based on event type
    if (data.type === 'page_view') {
      const { error } = await supabase
        .from('fund_page_views')
        .insert({
          fund_id: data.fund_id,
          session_id: data.session_id,
          user_id: userId,
          referrer: data.referrer || null,
          user_agent: data.user_agent || null,
        });

      if (error) {
        console.error('Error inserting page view:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to track page view' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Insert interaction
      const { error } = await supabase
        .from('fund_interactions')
        .insert({
          fund_id: data.fund_id,
          interaction_type: data.type,
          session_id: data.session_id,
          user_id: userId,
        });

      if (error) {
        console.error('Error inserting interaction:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to track interaction' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
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
