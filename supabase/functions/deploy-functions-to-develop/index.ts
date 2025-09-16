import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeploymentResult {
  function_name: string;
  status: 'success' | 'error' | 'warning';
  details: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting edge functions deployment to Funds_Develop...');

    // Initialize Supabase clients
    const prodSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const devSupabase = createClient(
      Deno.env.get('FUNDS_DEV_SUPABASE_URL')!,
      Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!
    );

    const deploymentResults: DeploymentResult[] = [];

    // List of edge functions to deploy
    const edgeFunctions = [
      'copy-to-develop',
      'delete-account',
      'migrate-data',
      'migrate-schema',
      'migrate-to-develop',
      'notify-super-admins',
      'send-notification-email',
      'setup-develop-schema'
    ];

    console.log(`📋 Found ${edgeFunctions.length} edge functions to deploy`);

    // Read the function code from the current project structure
    for (const functionName of edgeFunctions) {
      try {
        console.log(`🔧 Processing function: ${functionName}`);

        // Read the function code
        let functionCode: string;
        try {
          const functionPath = `./supabase/functions/${functionName}/index.ts`;
          functionCode = await Deno.readTextFile(functionPath);
        } catch (readError) {
          console.error(`❌ Could not read function ${functionName}:`, readError);
          deploymentResults.push({
            function_name: functionName,
            status: 'error',
            details: `Could not read function code: ${readError.message}`
          });
          continue;
        }

        // Create the function deployment payload
        const deploymentPayload = {
          name: functionName,
          source: functionCode,
          verify_jwt: false // Most functions in config.toml have this set to false
        };

        // Deploy to development project using Supabase Management API
        // Note: This would typically require additional API endpoints that might not be available
        // For now, we'll log the preparation and return instructions
        
        console.log(`✅ Prepared function ${functionName} for deployment`);
        deploymentResults.push({
          function_name: functionName,
          status: 'success',
          details: 'Function code prepared and ready for deployment'
        });

      } catch (error) {
        console.error(`❌ Error processing function ${functionName}:`, error);
        deploymentResults.push({
          function_name: functionName,
          status: 'error',
          details: error.message
        });
      }
    }

    // Generate summary
    const successCount = deploymentResults.filter(r => r.status === 'success').length;
    const errorCount = deploymentResults.filter(r => r.status === 'error').length;
    const warningCount = deploymentResults.filter(r => r.status === 'warning').length;

    const summary = {
      total_functions: edgeFunctions.length,
      successful_preparations: successCount,
      errors: errorCount,
      warnings: warningCount,
      deployment_results: deploymentResults,
      next_steps: [
        "Functions have been prepared for deployment",
        "To complete deployment, use the Supabase CLI:",
        "1. Set up CLI with Funds_Develop project",
        "2. Run: supabase functions deploy --project-ref fgwmkjivosjvvslbrvxe",
        "3. Update config.toml in Funds_Develop with verify_jwt = false settings"
      ],
      cli_commands: [
        "supabase login",
        "supabase link --project-ref fgwmkjivosjvvslbrvxe",
        "supabase functions deploy"
      ]
    };

    console.log('📊 Deployment preparation completed:', summary);

    return new Response(
      JSON.stringify(summary),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('💥 Unexpected error during deployment preparation:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Deployment preparation failed', 
        details: error.message,
        suggestion: 'Check the logs and ensure all environment variables are set correctly'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});