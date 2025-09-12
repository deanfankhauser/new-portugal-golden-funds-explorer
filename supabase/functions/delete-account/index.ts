import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeleteAccountRequest {
  user_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('❌ No authorization header found');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client with service role for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create regular client to verify the user's token
    const userSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Verify the user's JWT token
    const { data: { user }, error: userError } = await userSupabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      console.log('❌ Invalid token or user not found:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('🗑️ Deleting account for user:', user.email);

    // Record the deletion request
    const { error: recordError } = await supabase
      .from('account_deletion_requests')
      .insert({
        user_id: user.id,
        status: 'pending'
      });

    if (recordError) {
      console.error('❌ Failed to record deletion request:', recordError);
    }

    // Move deletion tasks to background to avoid client timeouts
    EdgeRuntime.waitUntil((async () => {
      try {
        // Delete any profiles associated with the user
        const { error: profileError } = await supabase
          .from('investor_profiles')
          .delete()
          .eq('user_id', user.id);

        if (profileError) {
          console.log('⚠️ Error deleting investor profile (may not exist):', profileError);
        }

        const { error: managerProfileError } = await supabase
          .from('manager_profiles')
          .delete()
          .eq('user_id', user.id);

        if (managerProfileError) {
          console.log('⚠️ Error deleting manager profile (may not exist):', managerProfileError);
        }

        // Delete the user account using admin client
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

        if (deleteError) {
          console.error('❌ Failed to delete user account:', deleteError);
          // Update deletion request status
          await supabase
            .from('account_deletion_requests')
            .update({ 
              status: 'failed',
              processed_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
          return;
        }

        // Update deletion request status
        await supabase
          .from('account_deletion_requests')
          .update({ 
            status: 'processed',
            processed_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        console.log('✅ Account successfully deleted for user:', user.email);
      } catch (bgError) {
        console.error('❌ Unexpected error in background deletion:', bgError);
        await supabase
          .from('account_deletion_requests')
          .update({ 
            status: 'failed',
            processed_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }
    })());

    // Respond immediately so the UI doesn't hang
    return new Response(
      JSON.stringify({ message: 'Deletion initiated' }),
      { 
        status: 202, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Unexpected error in delete-account function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});