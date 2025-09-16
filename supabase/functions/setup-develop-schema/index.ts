import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting development database setup...');

    // Get environment variables
    const devDbUrl = Deno.env.get('FUNDS_DEV_SUPABASE_DB_URL');
    const devSupabaseUrl = Deno.env.get('FUNDS_DEV_SUPABASE_URL');
    const devSupabaseKey = Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY');
    
    const prodSupabaseUrl = Deno.env.get('SUPABASE_URL');
    const prodSupabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!devDbUrl || !devSupabaseUrl || !devSupabaseKey || !prodSupabaseUrl || !prodSupabaseKey) {
      throw new Error('Missing required environment variables for database setup');
    }

    // Create Supabase clients
    const prodSupabase = createClient(prodSupabaseUrl, prodSupabaseKey);
    const devSupabase = createClient(devSupabaseUrl, devSupabaseKey);

    console.log('Created Supabase clients');

    // Create schema and tables in development database
    const schemaSQL = `
      -- Create custom types
      CREATE TYPE public.admin_role AS ENUM ('moderator', 'admin', 'super_admin');
      CREATE TYPE public.manager_status AS ENUM ('pending', 'approved', 'rejected');
      CREATE TYPE public.suggestion_status AS ENUM ('pending', 'approved', 'rejected');

      -- Create admin_users table
      CREATE TABLE IF NOT EXISTS public.admin_users (
        id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id uuid NOT NULL UNIQUE,
        role admin_role NOT NULL DEFAULT 'moderator'::admin_role,
        granted_by uuid NOT NULL,
        granted_at timestamp with time zone NOT NULL DEFAULT now(),
        created_at timestamp with time zone NOT NULL DEFAULT now()
      );

      -- Create manager_profiles table
      CREATE TABLE IF NOT EXISTS public.manager_profiles (
        id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id uuid NOT NULL UNIQUE,
        company_name text NOT NULL,
        manager_name text NOT NULL,
        email text NOT NULL,
        phone text,
        website text,
        description text,
        address text,
        city text,
        country text,
        registration_number text,
        license_number text,
        founded_year integer,
        assets_under_management bigint,
        logo_url text,
        status manager_status NOT NULL DEFAULT 'pending'::manager_status,
        approved_by uuid,
        approved_at timestamp with time zone,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now()
      );

      -- Create investor_profiles table
      CREATE TABLE IF NOT EXISTS public.investor_profiles (
        id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id uuid NOT NULL UNIQUE,
        first_name text NOT NULL,
        last_name text NOT NULL,
        email text NOT NULL,
        phone text,
        date_of_birth date,
        address text,
        city text,
        country text,
        investment_experience text,
        risk_tolerance text,
        annual_income_range text,
        net_worth_range text,
        avatar_url text,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now()
      );

      -- Create funds table
      CREATE TABLE IF NOT EXISTS public.funds (
        id text NOT NULL PRIMARY KEY,
        name text NOT NULL,
        description text,
        detailed_description text,
        minimum_investment bigint,
        expected_return_min numeric,
        expected_return_max numeric,
        lock_up_period_months integer,
        management_fee numeric,
        performance_fee numeric,
        aum bigint,
        inception_date date,
        currency text DEFAULT 'EUR'::text,
        risk_level text,
        manager_name text,
        category text,
        website text,
        tags text[],
        geographic_allocation jsonb,
        team_members jsonb,
        pdf_documents jsonb,
        faqs jsonb,
        gv_eligible boolean DEFAULT false,
        last_modified_by uuid,
        version integer DEFAULT 1,
        created_at timestamp with time zone DEFAULT now(),
        updated_at timestamp with time zone DEFAULT now()
      );

      -- Create fund_edit_suggestions table
      CREATE TABLE IF NOT EXISTS public.fund_edit_suggestions (
        id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        fund_id text NOT NULL,
        user_id uuid NOT NULL,
        current_values jsonb NOT NULL,
        suggested_changes jsonb NOT NULL,
        status suggestion_status NOT NULL DEFAULT 'pending'::suggestion_status,
        approved_by uuid,
        approved_at timestamp with time zone,
        rejection_reason text,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now()
      );

      -- Create fund_edit_history table
      CREATE TABLE IF NOT EXISTS public.fund_edit_history (
        id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        fund_id text NOT NULL,
        suggestion_id uuid,
        changed_by uuid NOT NULL,
        admin_user_id uuid NOT NULL,
        changes jsonb NOT NULL,
        applied_at timestamp with time zone NOT NULL DEFAULT now()
      );

      -- Create admin_activity_log table
      CREATE TABLE IF NOT EXISTS public.admin_activity_log (
        id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        admin_user_id uuid NOT NULL,
        action_type text NOT NULL,
        target_type text NOT NULL,
        target_id text,
        details jsonb,
        ip_address inet,
        user_agent text,
        created_at timestamp with time zone DEFAULT now()
      );

      -- Create account_deletion_requests table
      CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
        id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id uuid NOT NULL,
        status text DEFAULT 'pending'::text,
        requested_at timestamp with time zone DEFAULT now(),
        processed_at timestamp with time zone,
        created_at timestamp with time zone DEFAULT now()
      );

      -- Enable RLS on all tables
      ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.manager_profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.investor_profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.funds ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.fund_edit_suggestions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.fund_edit_history ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;
    `;

    console.log('Executing schema creation SQL...');
    
    // Execute schema creation using RPC call
    const { error: schemaError } = await devSupabase.rpc('execute_sql', { 
      query: schemaSQL 
    });

    if (schemaError) {
      console.error('Schema creation error:', schemaError);
      throw new Error(`Failed to create schema: ${schemaError.message}`);
    }

    console.log('Schema created successfully');

    // Copy data from production to development
    const tables = [
      'admin_users',
      'manager_profiles', 
      'investor_profiles',
      'funds',
      'fund_edit_suggestions',
      'fund_edit_history',
      'admin_activity_log',
      'account_deletion_requests'
    ];

    let copiedRecords = 0;

    for (const table of tables) {
      console.log(`Copying data from ${table}...`);
      
      // Get data from production
      const { data: prodData, error: prodError } = await prodSupabase
        .from(table)
        .select('*');

      if (prodError) {
        console.error(`Error reading from production ${table}:`, prodError);
        continue;
      }

      if (prodData && prodData.length > 0) {
        // Insert data into development
        const { error: devError } = await devSupabase
          .from(table)
          .upsert(prodData, { onConflict: 'id' });

        if (devError) {
          console.error(`Error inserting into development ${table}:`, devError);
        } else {
          copiedRecords += prodData.length;
          console.log(`Successfully copied ${prodData.length} records to ${table}`);
        }
      } else {
        console.log(`No data to copy for ${table}`);
      }
    }

    const result = {
      success: true,
      message: `Development database setup completed successfully. Copied ${copiedRecords} total records.`,
      copiedRecords
    };

    console.log('Setup completed:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in setup-develop-schema function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});