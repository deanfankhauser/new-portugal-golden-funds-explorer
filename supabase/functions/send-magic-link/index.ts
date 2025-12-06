import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { generateMagicLinkEmail } from '../_shared/email-templates.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MagicLinkRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: MagicLinkRequest = await req.json();
    console.log('🔐 Magic link request for:', email);

    if (!email || typeof email !== 'string') {
      throw new Error('Valid email address is required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate magic link using Supabase Admin API
    console.log('🔑 Generating magic link via Supabase Admin API...');
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}/auth/v1/verify`,
      },
    });

    if (linkError) {
      console.error('❌ Error generating magic link:', linkError);
      throw new Error(`Failed to generate magic link: ${linkError.message}`);
    }

    console.log('✅ Magic link generated successfully');
    const magicLink = linkData.properties.action_link;

    // Send email via Postmark
    const postmarkToken = Deno.env.get('POSTMARK_SERVER_TOKEN') || Deno.env.get('POSTMARK_API_KEY');
    if (!postmarkToken) {
      throw new Error('Missing Postmark API token');
    }

    const emailContent = generateMagicLinkEmail({
      email,
      magicLink,
    });

    console.log('📧 Sending magic link email via Postmark...');
    const postmarkResponse = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': postmarkToken,
      },
      body: JSON.stringify({
        From: 'Movingto Funds <noreply@movingto.com>',
        To: email,
        Subject: 'Sign in to Movingto Funds',
        HtmlBody: emailContent.html,
        TextBody: emailContent.text,
        MessageStream: 'outbound',
      }),
    });

    if (!postmarkResponse.ok) {
      const errorData = await postmarkResponse.text();
      console.error('❌ Postmark error:', errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const postmarkData = await postmarkResponse.json();
    console.log('✅ Email sent successfully:', postmarkData.MessageID);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Magic link sent successfully',
        messageId: postmarkData.MessageID 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('❌ Error in send-magic-link function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send magic link',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
