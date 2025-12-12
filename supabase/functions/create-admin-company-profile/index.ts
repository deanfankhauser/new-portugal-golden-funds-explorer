import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyAdminAuth, createUnauthorizedResponse } from '../_shared/adminAuth.ts';

interface ManagerHighlight {
  title: string;
  description: string;
  icon?: string;
}

interface ManagerFAQ {
  question: string;
  answer: string;
}

interface ProfileData {
  company_name: string;
  manager_name?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  country?: string;
  founded_year?: number;
  logo_url?: string;
  description?: string;
  website?: string;
  assets_under_management?: number;
  registration_number?: string;
  license_number?: string;
  manager_about?: string;
  manager_highlights?: ManagerHighlight[];
  manager_faqs?: ManagerFAQ[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // ========== ADMIN AUTHENTICATION CHECK ==========
    const authResult = await verifyAdminAuth(req);
    if (!authResult.isAdmin) {
      console.warn(`Unauthorized access attempt to create-admin-company-profile: ${authResult.error}`);
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

    const profileData: ProfileData = await req.json();

    if (!profileData.company_name?.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Company name is required'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Generate placeholder email
    const companySlug = profileData.company_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const placeholderEmail = `${companySlug}-${Date.now()}@placeholder.internal`;

    console.log(`Creating auth user with email: ${placeholderEmail}`);

    // Create auth user first
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: placeholderEmail,
      password: `temp-no-access-${crypto.randomUUID()}`,
      email_confirm: true,
      user_metadata: {
        company_name: profileData.company_name,
        manager_name: profileData.manager_name || profileData.company_name
      }
    });

    if (authError) {
      console.error('Auth user creation failed:', authError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to create auth user: ${authError.message}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    console.log(`Auth user created with ID: ${authData.user.id}`);

    // Create profile with the real user_id
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        email: placeholderEmail,
        company_name: profileData.company_name.trim(),
        manager_name: profileData.manager_name?.trim() || profileData.company_name.trim(),
        first_name: profileData.first_name?.trim() || null,
        last_name: profileData.last_name?.trim() || null,
        city: profileData.city?.trim() || null,
        country: profileData.country?.trim() || null,
        founded_year: profileData.founded_year || null,
        logo_url: profileData.logo_url?.trim() || null,
        description: profileData.description?.trim() || null,
        website: profileData.website?.trim() || null,
        assets_under_management: profileData.assets_under_management || null,
        registration_number: profileData.registration_number?.trim() || null,
        license_number: profileData.license_number?.trim() || null,
        manager_about: profileData.manager_about?.trim() || null,
        manager_highlights: profileData.manager_highlights || [],
        manager_faqs: profileData.manager_faqs || [],
      })
      .select('id')
      .single();

    if (profileError) {
      console.error('Profile creation failed:', profileError);
      // Clean up the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to create profile: ${profileError.message}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    console.log(`Profile created with ID: ${profile.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        profile_id: profile.id,
        user_id: authData.user.id,
        message: `Company profile "${profileData.company_name}" created successfully`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error creating company profile:', error);
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
