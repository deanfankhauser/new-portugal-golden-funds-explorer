import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PostmarkOpenEvent {
  RecordType: 'Open';
  MessageID: string;
  ReceivedAt: string;
  FirstOpen: boolean;
}

interface PostmarkClickEvent {
  RecordType: 'Click';
  MessageID: string;
  ReceivedAt: string;
  OriginalLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const event = await req.json();
    console.log('Postmark webhook received:', event.RecordType, event.MessageID);

    // Handle Open events
    if (event.RecordType === 'Open') {
      const openEvent = event as PostmarkOpenEvent;
      
      // Update only if this is the first open
      if (openEvent.FirstOpen) {
        const { error } = await supabase
          .from('fund_manager_email_logs')
          .update({
            opened_at: openEvent.ReceivedAt,
            updated_at: new Date().toISOString(),
          })
          .eq('postmark_message_id', openEvent.MessageID)
          .is('opened_at', null); // Only update if not already opened

        if (error) {
          console.error('Error updating open event:', error);
        } else {
          console.log('Open event recorded for:', openEvent.MessageID);
        }
      }
    }

    // Handle Click events
    if (event.RecordType === 'Click') {
      const clickEvent = event as PostmarkClickEvent;
      
      // Get current record to increment click count
      const { data: existing } = await supabase
        .from('fund_manager_email_logs')
        .select('click_count, first_click_at')
        .eq('postmark_message_id', clickEvent.MessageID)
        .single();

      if (existing) {
        const updateData: any = {
          click_count: (existing.click_count || 0) + 1,
          updated_at: new Date().toISOString(),
        };

        // Set first_click_at if this is the first click
        if (!existing.first_click_at) {
          updateData.first_click_at = clickEvent.ReceivedAt;
        }

        const { error } = await supabase
          .from('fund_manager_email_logs')
          .update(updateData)
          .eq('postmark_message_id', clickEvent.MessageID);

        if (error) {
          console.error('Error updating click event:', error);
        } else {
          console.log('Click event recorded for:', clickEvent.MessageID);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
