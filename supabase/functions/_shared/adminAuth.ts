// Admin authentication utility for edge functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

export interface AdminAuthResult {
  isAdmin: boolean;
  userId: string | null;
  error: string | null;
}

/**
 * Verifies that the request comes from an authenticated admin user.
 * Extracts JWT from Authorization header and checks admin status via RPC.
 */
export async function verifyAdminAuth(req: Request): Promise<AdminAuthResult> {
  try {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { isAdmin: false, userId: null, error: 'Missing or invalid Authorization header' };
    }

    const token = authHeader.replace('Bearer ', '');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return { isAdmin: false, userId: null, error: 'Missing Supabase configuration' };
    }

    // Create client with the user's JWT to check their admin status
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` }
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { isAdmin: false, userId: null, error: 'Invalid or expired token' };
    }

    // Check if user is an admin using the is_user_admin RPC
    const { data: isAdmin, error: adminError } = await supabase.rpc('is_user_admin');
    
    if (adminError) {
      console.error('Error checking admin status:', adminError);
      return { isAdmin: false, userId: user.id, error: 'Failed to verify admin status' };
    }

    return { isAdmin: !!isAdmin, userId: user.id, error: null };
  } catch (error) {
    console.error('Admin auth verification error:', error);
    return { isAdmin: false, userId: null, error: 'Authentication verification failed' };
  }
}

/**
 * Creates an unauthorized response with proper CORS headers
 */
export function createUnauthorizedResponse(message: string, corsHeaders: Record<string, string>): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Unauthorized',
      message,
      timestamp: new Date().toISOString()
    }),
    {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}
