import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SyncResult {
  operation: string;
  status: 'success' | 'error' | 'warning';
  details: string;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting funds-only sync from production to develop...');

    const results: SyncResult[] = [];
    const startTime = new Date().toISOString();

    // Initialize Supabase clients
    const prodSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const devSupabase = createClient(
      Deno.env.get('FUNDS_DEV_SUPABASE_URL')!,
      Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('✅ Supabase clients initialized');
    results.push({
      operation: 'client_initialization',
      status: 'success',
      details: 'Both production and develop Supabase clients initialized successfully',
      timestamp: new Date().toISOString()
    });

    // Fetch funds data from production
    console.log('📊 Fetching funds data from production...');
    const { data: prodFunds, error: prodFundsError } = await prodSupabase
      .from('funds')
      .select('*');

    if (prodFundsError) {
      console.error('❌ Error fetching funds:', prodFundsError);
      results.push({
        operation: 'fetch_funds',
        status: 'error',
        details: `Failed to fetch funds: ${prodFundsError.message}`,
        timestamp: new Date().toISOString()
      });

      return new Response(
        JSON.stringify({
          sync_started_at: startTime,
          sync_completed_at: new Date().toISOString(),
          results,
          summary: 'Funds sync failed'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!prodFunds || prodFunds.length === 0) {
      console.log('ℹ️  No funds found in production');
      results.push({
        operation: 'sync_funds',
        status: 'success',
        details: 'No funds to sync',
        timestamp: new Date().toISOString()
      });

      return new Response(
        JSON.stringify({
          sync_started_at: startTime,
          sync_completed_at: new Date().toISOString(),
          total_operations: results.length,
          results
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Delete existing funds in develop
    console.log('🧹 Clearing existing funds in develop...');
    const { error: deleteError } = await devSupabase
      .from('funds')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.error('❌ Error clearing funds in develop:', deleteError);
      results.push({
        operation: 'clear_develop_funds',
        status: 'warning',
        details: `Failed to clear funds in develop: ${deleteError.message}`,
        timestamp: new Date().toISOString()
      });
    } else {
      results.push({
        operation: 'clear_develop_funds',
        status: 'success',
        details: 'Cleared existing funds in develop',
        timestamp: new Date().toISOString()
      });
    }

    // Insert funds in batches
    console.log(`🚚 Inserting ${prodFunds.length} funds into develop...`);
    const chunkSize = 500;
    for (let i = 0; i < prodFunds.length; i += chunkSize) {
      const chunk = prodFunds.slice(i, i + chunkSize);
      const { error: insertError } = await devSupabase
        .from('funds')
        .insert(chunk);
      if (insertError) {
        console.error('❌ Error inserting funds chunk:', insertError);
        results.push({
          operation: `insert_funds_chunk_${i / chunkSize + 1}`,
          status: 'error',
          details: `Failed to insert funds chunk: ${insertError.message}`,
          timestamp: new Date().toISOString()
        });
        return new Response(
          JSON.stringify({
            sync_started_at: startTime,
            sync_completed_at: new Date().toISOString(),
            results,
            summary: 'Funds sync encountered errors'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('✅ Successfully synced funds to develop');
    results.push({
      operation: 'sync_funds',
      status: 'success',
      details: `Synced ${prodFunds.length} funds to develop`,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({
        sync_started_at: startTime,
        sync_completed_at: new Date().toISOString(),
        total_operations: results.length,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Unexpected error during funds sync:', error);
    return new Response(
      JSON.stringify({
        error: 'Funds sync failed',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});