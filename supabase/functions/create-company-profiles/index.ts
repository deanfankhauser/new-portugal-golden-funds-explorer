import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyAdminAuth, createUnauthorizedResponse } from '../_shared/adminAuth.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // ========== ADMIN AUTHENTICATION CHECK ==========
    const authResult = await verifyAdminAuth(req);
    if (!authResult.isAdmin) {
      console.warn(`Unauthorized access attempt to create-company-profiles: ${authResult.error}`);
      return createUnauthorizedResponse(
        authResult.error || 'Admin privileges required to access this function',
        corsHeaders
      );
    }
    console.log(`Admin access verified for user: ${authResult.userId}`);
    // ================================================

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const companies = [
      { company_name: 'IM Gestão de Ativos (IMGA)', manager_name: 'IM Gestão de Ativos', email: 'imga@placeholder.movingto.com', website: null, description: 'Portuguese asset management company managing multiple investment funds including equity, tech, corporate debt, and real estate funds.' },
      { company_name: 'Insight Venture - Sociedade de Capital de Risco, S.A.', manager_name: 'Insight Venture', email: 'insightventure@placeholder.movingto.com', website: 'https://insightventure.com', description: 'Venture capital firm managing diversified investment funds focused on capital appreciation and venture opportunities.' },
      { company_name: 'Lince Capital, SCR, S.A.', manager_name: 'Lince Capital', email: 'lincecapital@placeholder.movingto.com', website: 'https://lince-capital.com', description: 'Risk capital management company offering growth and yield focused investment solutions.' },
      { company_name: 'BiG Capital SGOIC', manager_name: 'BiG Capital', email: 'bigcapital@placeholder.movingto.com', website: null, description: 'Specialized investment management company focused on Portuguese market opportunities.' },
      { company_name: 'Biz Capital SGOIC', manager_name: 'Biz Capital', email: 'bizcapital@placeholder.movingto.com', website: null, description: 'Investment management firm specializing in Portuguese real estate and business investments.' },
      { company_name: 'Celtis Venture Partners', manager_name: 'Celtis Venture Partners', email: 'celtisventures@placeholder.movingto.com', website: null, description: 'Venture capital firm focused on steady growth investment opportunities.' },
      { company_name: 'Fortitude Capital', manager_name: 'Fortitude Capital', email: 'fortitudecapital@placeholder.movingto.com', website: null, description: 'Special situations investment firm managing opportunistic investment strategies.' },
      { company_name: 'Growth Partners Capital, S.A.', manager_name: 'Growth Partners Capital', email: 'growthpartners@placeholder.movingto.com', website: null, description: 'Capital management company focused on growth-oriented investment opportunities.' },
      { company_name: 'Insula Capital SGOIC', manager_name: 'Insula Capital', email: 'insulacapital@placeholder.movingto.com', website: null, description: 'Specialized investment management focused on alternative asset classes including flexible workspaces.' },
      { company_name: 'Quadrantis Capital', manager_name: 'Quadrantis Capital', email: 'quadrantis@placeholder.movingto.com', website: null, description: 'Investment management firm with focus on creative industries and media investments.' },
      { company_name: 'Tejo Ventures & Green One Capital', manager_name: 'Tejo Ventures', email: 'tejoventures@placeholder.movingto.com', website: null, description: 'Sustainable investment firm focusing on renewable energy and green technology opportunities.' },
      { company_name: 'Visadoro', manager_name: 'Visadoro', email: 'visadoro@placeholder.movingto.com', website: null, description: 'Investment management company offering curated fund solutions.' },
    ];

    const results = [];

    for (const company of companies) {
      try {
        // Check if user already exists
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', company.email)
          .single();

        if (existingProfile) {
          results.push({
            company: company.company_name,
            status: 'skipped',
            message: 'Profile already exists'
          });
          continue;
        }

        // Create auth user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: company.email,
          password: `temp-no-access-${crypto.randomUUID()}`,
          email_confirm: true,
          user_metadata: {
            company_name: company.company_name,
            manager_name: company.manager_name
          }
        });

        if (authError) {
          results.push({
            company: company.company_name,
            status: 'error',
            message: `Auth error: ${authError.message}`
          });
          continue;
        }

        // Create profile
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            email: company.email,
            company_name: company.company_name,
            manager_name: company.manager_name,
            website: company.website,
            city: 'Lisbon',
            country: 'Portugal',
            description: company.description
          });

        if (profileError) {
          results.push({
            company: company.company_name,
            status: 'error',
            message: `Profile error: ${profileError.message}`
          });
        } else {
          results.push({
            company: company.company_name,
            status: 'created',
            message: 'Successfully created'
          });
        }
      } catch (error: any) {
        results.push({
          company: company.company_name,
          status: 'error',
          message: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error creating company profiles:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
