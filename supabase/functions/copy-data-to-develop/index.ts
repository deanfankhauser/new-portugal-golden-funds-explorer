import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DatabaseRecord {
  [key: string]: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting data copy to development database...');

    // Initialize production Supabase client
    const prodSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Initialize development Supabase client
    const devSupabase = createClient(
      Deno.env.get('FUNDS_DEV_SUPABASE_URL') ?? '',
      Deno.env.get('FUNDS_DEV_SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const results = {
      funds: 0,
      manager_profiles: 0,
      investor_profiles: 0,
      admin_users: 0,
      fund_edit_suggestions: 0,
      fund_edit_history: 0,
      saved_funds: 0,
      errors: [] as string[]
    };

    // Copy funds data
    try {
      console.log('Copying funds data...');
      const { data: fundsData, error: fundsError } = await prodSupabase
        .from('funds')
        .select('*');

      if (fundsError) throw fundsError;

      if (fundsData && fundsData.length > 0) {
        // Clear existing funds in development
        await devSupabase.from('funds').delete().neq('id', '');
        
        // Insert new funds data
        const { error: insertError } = await devSupabase
          .from('funds')
          .insert(fundsData);

        if (insertError) throw insertError;
        results.funds = fundsData.length;
        console.log(`Copied ${fundsData.length} funds`);
      }
    } catch (error) {
      console.error('Error copying funds:', error);
      results.errors.push(`Funds: ${error.message}`);
    }

    // Copy manager profiles
    try {
      console.log('Copying manager profiles...');
      const { data: managersData, error: managersError } = await prodSupabase
        .from('manager_profiles')
        .select('*');

      if (managersError) throw managersError;

      if (managersData && managersData.length > 0) {
        // Clear existing manager profiles in development
        await devSupabase.from('manager_profiles').delete().neq('id', '');
        
        // Insert new manager profiles data
        const { error: insertError } = await devSupabase
          .from('manager_profiles')
          .insert(managersData);

        if (insertError) throw insertError;
        results.manager_profiles = managersData.length;
        console.log(`Copied ${managersData.length} manager profiles`);
      }
    } catch (error) {
      console.error('Error copying manager profiles:', error);
      results.errors.push(`Manager profiles: ${error.message}`);
    }

    // Copy investor profiles
    try {
      console.log('Copying investor profiles...');
      const { data: investorsData, error: investorsError } = await prodSupabase
        .from('investor_profiles')
        .select('*');

      if (investorsError) throw investorsError;

      if (investorsData && investorsData.length > 0) {
        // Clear existing investor profiles in development
        await devSupabase.from('investor_profiles').delete().neq('id', '');
        
        // Insert new investor profiles data
        const { error: insertError } = await devSupabase
          .from('investor_profiles')
          .insert(investorsData);

        if (insertError) throw insertError;
        results.investor_profiles = investorsData.length;
        console.log(`Copied ${investorsData.length} investor profiles`);
      }
    } catch (error) {
      console.error('Error copying investor profiles:', error);
      results.errors.push(`Investor profiles: ${error.message}`);
    }

    // Copy admin users
    try {
      console.log('Copying admin users...');
      const { data: adminData, error: adminError } = await prodSupabase
        .from('admin_users')
        .select('*');

      if (adminError) throw adminError;

      if (adminData && adminData.length > 0) {
        // Clear existing admin users in development
        await devSupabase.from('admin_users').delete().neq('id', '');
        
        // Insert new admin users data
        const { error: insertError } = await devSupabase
          .from('admin_users')
          .insert(adminData);

        if (insertError) throw insertError;
        results.admin_users = adminData.length;
        console.log(`Copied ${adminData.length} admin users`);
      }
    } catch (error) {
      console.error('Error copying admin users:', error);
      results.errors.push(`Admin users: ${error.message}`);
    }

    // Copy fund edit suggestions
    try {
      console.log('Copying fund edit suggestions...');
      const { data: suggestionsData, error: suggestionsError } = await prodSupabase
        .from('fund_edit_suggestions')
        .select('*');

      if (suggestionsError) throw suggestionsError;

      if (suggestionsData && suggestionsData.length > 0) {
        // Clear existing suggestions in development
        await devSupabase.from('fund_edit_suggestions').delete().neq('id', '');
        
        // Insert new suggestions data
        const { error: insertError } = await devSupabase
          .from('fund_edit_suggestions')
          .insert(suggestionsData);

        if (insertError) throw insertError;
        results.fund_edit_suggestions = suggestionsData.length;
        console.log(`Copied ${suggestionsData.length} fund edit suggestions`);
      }
    } catch (error) {
      console.error('Error copying fund edit suggestions:', error);
      results.errors.push(`Fund edit suggestions: ${error.message}`);
    }

    // Copy fund edit history
    try {
      console.log('Copying fund edit history...');
      const { data: historyData, error: historyError } = await prodSupabase
        .from('fund_edit_history')
        .select('*');

      if (historyError) throw historyError;

      if (historyData && historyData.length > 0) {
        // Clear existing history in development
        await devSupabase.from('fund_edit_history').delete().neq('id', '');
        
        // Insert new history data
        const { error: insertError } = await devSupabase
          .from('fund_edit_history')
          .insert(historyData);

        if (insertError) throw insertError;
        results.fund_edit_history = historyData.length;
        console.log(`Copied ${historyData.length} fund edit history records`);
      }
    } catch (error) {
      console.error('Error copying fund edit history:', error);
      results.errors.push(`Fund edit history: ${error.message}`);
    }

    // Copy saved funds
    try {
      console.log('Copying saved funds...');
      const { data: savedData, error: savedError } = await prodSupabase
        .from('saved_funds')
        .select('*');

      if (savedError) throw savedError;

      if (savedData && savedData.length > 0) {
        // Clear existing saved funds in development
        await devSupabase.from('saved_funds').delete().neq('id', '');
        
        // Insert new saved funds data
        const { error: insertError } = await devSupabase
          .from('saved_funds')
          .insert(savedData);

        if (insertError) throw insertError;
        results.saved_funds = savedData.length;
        console.log(`Copied ${savedData.length} saved funds`);
      }
    } catch (error) {
      console.error('Error copying saved funds:', error);
      results.errors.push(`Saved funds: ${error.message}`);
    }

    const totalRecords = results.funds + results.manager_profiles + results.investor_profiles + 
                        results.admin_users + results.fund_edit_suggestions + results.fund_edit_history + 
                        results.saved_funds;

    console.log(`Data copy completed. Total records copied: ${totalRecords}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully copied ${totalRecords} records to development database`,
        results,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error) {
    console.error('Error in copy-data-to-develop function:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});