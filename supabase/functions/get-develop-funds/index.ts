import { getCorsHeaders } from '../_shared/security.ts';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error occurred';
};

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Fetching funds from Funds_Develop project...');
    
    const fundsDevUrl = Deno.env.get('VITE_FUNDS_DEV_SUPABASE_URL');
    const fundsDevKey = Deno.env.get('VITE_FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY');
    
    if (!fundsDevUrl || !fundsDevKey) {
      console.error('❌ Missing Funds_Develop credentials');
      return new Response(
        JSON.stringify({ 
          error: 'Missing Funds_Develop credentials',
          funds: []
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('🔗 Using Funds_Develop URL:', fundsDevUrl.substring(0, 30) + '...');

    // Fetch funds using service role key with proper headers
    const response = await fetch(`${fundsDevUrl}/rest/v1/funds?select=*&order=created_at.asc`, {
      headers: {
        'Authorization': `Bearer ${fundsDevKey}`,
        'apikey': fundsDevKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });

    if (!response.ok) {
      console.error('❌ Failed to fetch from Funds_Develop:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ 
          error: `HTTP ${response.status}: ${response.statusText}`,
          funds: []
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const funds = await response.json();
    console.log('✅ Successfully fetched', funds.length, 'funds from Funds_Develop');

    return new Response(
      JSON.stringify({ funds, error: null }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Error in get-develop-funds:', error);
    return new Response(
      JSON.stringify({ 
        error: getErrorMessage(error),
        funds: []
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});