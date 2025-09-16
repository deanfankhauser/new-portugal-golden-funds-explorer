import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting schema migration process...');

    // Production database client (service role)
    const prodSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Development database client (service role)
    const devSupabase = createClient(
      Deno.env.get('FUNDS_DEV_SUPABASE_URL')!,
      Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('Connected to both databases');

    const results: Array<{
      type: string;
      name: string;
      status: 'success' | 'error';
      error?: string;
    }> = [];

    // Step 1: Create custom types/enums first
    console.log('Creating custom types...');
    
    const enumsQuery = `
      SELECT typname, enumlabel 
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid 
      WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      ORDER BY typname, e.enumsortorder;
    `;

    const { data: enums, error: enumsError } = await prodSupabase.rpc('execute_sql', { 
      query: enumsQuery 
    });

    if (enumsError) {
      console.error('Error fetching enums:', enumsError);
    } else if (enums) {
      // Group enums by type name
      const enumTypes = enums.reduce((acc: any, row: any) => {
        if (!acc[row.typname]) {
          acc[row.typname] = [];
        }
        acc[row.typname].push(row.enumlabel);
        return acc;
      }, {});

      for (const [typeName, labels] of Object.entries(enumTypes)) {
        try {
          const createEnumSQL = `CREATE TYPE public.${typeName} AS ENUM (${(labels as string[]).map(l => `'${l}'`).join(', ')});`;
          
          const { error: createEnumError } = await devSupabase.rpc('execute_sql', { 
            query: createEnumSQL 
          });

          if (createEnumError && !createEnumError.message.includes('already exists')) {
            throw createEnumError;
          }

          results.push({ type: 'enum', name: typeName, status: 'success' });
          console.log(`Created enum: ${typeName}`);
        } catch (error: any) {
          results.push({ type: 'enum', name: typeName, status: 'error', error: error.message });
          console.error(`Failed to create enum ${typeName}:`, error);
        }
      }
    }

    // Step 2: Create tables
    console.log('Creating tables...');
    
    const tablesQuery = `
      SELECT 
        table_name,
        string_agg(
          column_name || ' ' || 
          CASE 
            WHEN data_type = 'USER-DEFINED' THEN udt_name
            WHEN data_type = 'ARRAY' THEN 'text[]'
            ELSE data_type 
          END ||
          CASE 
            WHEN character_maximum_length IS NOT NULL THEN '(' || character_maximum_length || ')'
            WHEN numeric_precision IS NOT NULL AND numeric_scale IS NOT NULL THEN '(' || numeric_precision || ',' || numeric_scale || ')'
            ELSE '' 
          END ||
          CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
          CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default ELSE '' END,
          ', '
        ) as columns_def
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name NOT LIKE '%_view'
        AND table_name NOT LIKE 'managers_%'
        AND table_name NOT LIKE 'public_%'
        AND table_name NOT LIKE 'security_%'
      GROUP BY table_name
      ORDER BY table_name;
    `;

    const { data: tables, error: tablesError } = await prodSupabase.rpc('execute_sql', { 
      query: tablesQuery 
    });

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
    } else if (tables) {
      for (const table of tables) {
        try {
          const createTableSQL = `CREATE TABLE IF NOT EXISTS public.${table.table_name} (${table.columns_def});`;
          
          const { error: createTableError } = await devSupabase.rpc('execute_sql', { 
            query: createTableSQL 
          });

          if (createTableError) {
            throw createTableError;
          }

          // Enable RLS
          const enableRLSSQL = `ALTER TABLE public.${table.table_name} ENABLE ROW LEVEL SECURITY;`;
          await devSupabase.rpc('execute_sql', { query: enableRLSSQL });

          results.push({ type: 'table', name: table.table_name, status: 'success' });
          console.log(`Created table: ${table.table_name}`);
        } catch (error: any) {
          results.push({ type: 'table', name: table.table_name, status: 'error', error: error.message });
          console.error(`Failed to create table ${table.table_name}:`, error);
        }
      }
    }

    // Step 3: Create functions
    console.log('Creating functions...');
    
    const functionsQuery = `
      SELECT 
        proname as function_name,
        pg_get_functiondef(oid) as function_definition
      FROM pg_proc 
      WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        AND prokind = 'f';
    `;

    const { data: functions, error: functionsError } = await prodSupabase.rpc('execute_sql', { 
      query: functionsQuery 
    });

    if (functionsError) {
      console.error('Error fetching functions:', functionsError);
    } else if (functions) {
      for (const func of functions) {
        try {
          const { error: createFuncError } = await devSupabase.rpc('execute_sql', { 
            query: func.function_definition 
          });

          if (createFuncError && !createFuncError.message.includes('already exists')) {
            throw createFuncError;
          }

          results.push({ type: 'function', name: func.function_name, status: 'success' });
          console.log(`Created function: ${func.function_name}`);
        } catch (error: any) {
          results.push({ type: 'function', name: func.function_name, status: 'error', error: error.message });
          console.error(`Failed to create function ${func.function_name}:`, error);
        }
      }
    }

    // Step 4: Create RLS policies
    console.log('Creating RLS policies...');
    
    const policiesQuery = `
      SELECT 
        schemaname,
        tablename,
        policyname,
        cmd,
        roles,
        qual,
        with_check
      FROM pg_policies 
      WHERE schemaname = 'public';
    `;

    const { data: policies, error: policiesError } = await prodSupabase.rpc('execute_sql', { 
      query: policiesQuery 
    });

    if (policiesError) {
      console.error('Error fetching policies:', policiesError);
    } else if (policies) {
      for (const policy of policies) {
        try {
          let policySQL = `CREATE POLICY "${policy.policyname}" ON public.${policy.tablename}`;
          
          if (policy.cmd !== 'ALL') {
            policySQL += ` FOR ${policy.cmd}`;
          }
          
          if (policy.qual) {
            policySQL += ` USING (${policy.qual})`;
          }
          
          if (policy.with_check) {
            policySQL += ` WITH CHECK (${policy.with_check})`;
          }
          
          policySQL += ';';

          const { error: createPolicyError } = await devSupabase.rpc('execute_sql', { 
            query: policySQL 
          });

          if (createPolicyError && !createPolicyError.message.includes('already exists')) {
            throw createPolicyError;
          }

          results.push({ type: 'policy', name: `${policy.tablename}.${policy.policyname}`, status: 'success' });
          console.log(`Created policy: ${policy.tablename}.${policy.policyname}`);
        } catch (error: any) {
          results.push({ type: 'policy', name: `${policy.tablename}.${policy.policyname}`, status: 'error', error: error.message });
          console.error(`Failed to create policy ${policy.tablename}.${policy.policyname}:`, error);
        }
      }
    }

    console.log('Schema migration completed!');

    const summary = {
      total_objects: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      by_type: results.reduce((acc: any, r) => {
        if (!acc[r.type]) acc[r.type] = { success: 0, error: 0 };
        acc[r.type][r.status]++;
        return acc;
      }, {})
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Schema migration completed',
        results,
        summary
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Schema migration failed:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: 'Check function logs for more details'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});