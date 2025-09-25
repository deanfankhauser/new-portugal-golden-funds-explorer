import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Static fund data - this is a sample, in real app this would import from the actual static data
const staticFunds = [
  {
    id: "3cc-golden-income",
    name: "3CC Golden Income Fund",
    description: "A fixed-income fund focusing on Portuguese government bonds and corporate debt securities",
    detailedDescription: "The 3CC Golden Income Fund is designed to provide stable income through a diversified portfolio of Portuguese fixed-income securities. The fund primarily invests in government bonds and high-grade corporate debt, targeting investors seeking regular income with capital preservation. With a focus on Portuguese securities, the fund qualifies for Golden Visa investments while maintaining a conservative risk profile suitable for income-focused investors.",
    manager_name: "3CC Capital",
    minimum_investment: 500000,
    management_fee: 1.5,
    performance_fee: 0,
    category: "Fixed Income",
    gv_eligible: true,
    expected_return_min: 4,
    expected_return_max: 6,
    risk_level: "Low",
    currency: "EUR",
    tags: ["Fixed Income", "Government Bonds", "Low-risk", "€500k+", "Conservative"]
  },
  {
    id: "portugal-investment-1",
    name: "Portugal Investment 1 Fund",
    description: "Diversified equity fund investing in Portuguese listed companies with strong growth potential",
    detailedDescription: "Portugal Investment 1 Fund focuses on Portuguese equity markets, investing in a diversified portfolio of listed companies across various sectors. The fund targets companies with strong fundamentals, growth potential, and market leadership positions within Portugal. This strategy provides investors with exposure to the Portuguese economy while meeting Golden Visa investment requirements through equity investments in Portuguese companies.",
    manager_name: "Portugal Asset Management",
    minimum_investment: 500000,
    management_fee: 2.0,
    performance_fee: 15,
    category: "Equity",
    gv_eligible: true,
    expected_return_min: 8,
    expected_return_max: 12,
    risk_level: "Medium",
    currency: "EUR",
    tags: ["Equity", "Portuguese Markets", "Medium-risk", "€500k+", "Growth"]
  }
  // Add more funds here - this is just a sample for the migration function
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Get current fund count
    const { count: currentCount } = await supabaseClient
      .from('funds')
      .select('*', { count: 'exact' })

    console.log(`Current funds in database: ${currentCount}`)

    // For now, let's just return the status - we need to implement the full migration logic
    // In a real implementation, we would:
    // 1. Import all static fund data
    // 2. Transform it to match the database schema
    // 3. Insert all missing funds
    
    return new Response(
      JSON.stringify({ 
        message: 'Fund migration function ready',
        currentFundCount: currentCount,
        shouldHave: 29,
        status: 'ready_for_implementation'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in migrate-static-funds:', error)
    return new Response(
      JSON.stringify({ error: (error instanceof Error ? error.message : String(error)) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})