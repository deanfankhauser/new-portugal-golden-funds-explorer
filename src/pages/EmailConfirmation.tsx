import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log('🔐 Email confirmation starting...');
        console.log('🔐 Current URL:', window.location.href);
        console.log('🔐 Hash:', window.location.hash);
        console.log('🔐 Search:', window.location.search);
        
        // Let Supabase automatically handle the auth callback
        // This will process tokens from both URL fragments and query params
        const { data, error } = await supabase.auth.getSession();
        
        console.log('🔐 Session after URL processing:', { 
          hasSession: !!data.session, 
          hasUser: !!data.session?.user,
          error: error?.message 
        });
        
        // Check if we have an authenticated session
        if (data.session?.user) {
          console.log('🔐 User authenticated successfully:', data.session.user.email);
          
          // Send welcome email for new confirmations (non-blocking)
          try {
            await supabase.functions.invoke('send-welcome-email', {
              body: {
                email: data.session.user.email,
                loginUrl: `${window.location.origin}/`
              }
            });
            console.log('🔐 Welcome email sent successfully');
          } catch (welcomeError) {
            console.log('🔐 Welcome email failed (non-critical):', welcomeError);
          }

          // Clean URL to remove sensitive tokens
          try { 
            window.history.replaceState({}, document.title, window.location.pathname); 
          } catch (e) {
            console.log('🔐 URL cleanup failed:', e);
          }

          setStatus('success');
          setMessage('Email confirmed successfully! Welcome to your account.');
          toast.success('Email Confirmed', { description: 'Your email has been verified successfully!' });
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        // If no session but we're on the confirmation page, check for explicit errors
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = searchParams;
        
        const errorCode = hashParams.get('error_code') || queryParams.get('error_code');
        const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');
        const error_description = hashParams.get('error') || queryParams.get('error');

        if (errorCode || error_description) {
          console.log('🔐 Error from URL:', { errorCode, errorDescription, error_description });
          setStatus('error');
          setMessage(
            errorCode === 'otp_expired' || error_description?.includes('expired')
              ? 'This confirmation link has expired. Please request a new email.'
              : errorDescription || error_description || 'Failed to confirm email. The link may be invalid or expired.'
          );
          return;
        }

        // Check if we have token parameters (for processing)
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const tokenHash = queryParams.get('token_hash') || queryParams.get('token');
        const type = hashParams.get('type') || queryParams.get('type') || 'signup';

        console.log('🔐 Available tokens:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasTokenHash: !!tokenHash,
          type
        });

        // If we have access/refresh tokens but no session, try to set session manually
        if (accessToken && refreshToken) {
          console.log('🔐 Setting session manually with tokens...');
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('🔐 setSession error:', sessionError);
            setStatus('error');
            setMessage(sessionError.message || 'Failed to establish session from confirmation link.');
            return;
          }

          // Recheck session after setting
          const { data: newSession } = await supabase.auth.getSession();
          if (newSession.session?.user) {
            console.log('🔐 Session established successfully');
            setStatus('success');
            setMessage('Email confirmed successfully! Welcome to your account.');
            toast.success('Email Confirmed', { description: 'Your email has been verified successfully!' });
            setTimeout(() => navigate('/'), 2000);
            return;
          }
        }

        // If we have a token hash, try OTP verification
        if (tokenHash && type) {
          console.log('🔐 Verifying OTP with token hash...');
          const { error: otpError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as 'signup' | 'recovery',
          });

          if (otpError) {
            console.error('🔐 verifyOtp error:', otpError);
            setStatus('error');
            setMessage(otpError.message || 'Failed to verify the link. It may have expired.');
            return;
          }

          setStatus('success');
          setMessage('Email confirmed successfully! Welcome to your account.');
          toast.success('Email Confirmed', { description: 'Your email has been verified successfully!' });
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        // If we reach here, we likely don't have the required tokens
        console.log('🔐 No valid tokens found for confirmation');
        setStatus('error');
        setMessage('Invalid confirmation link. Missing authentication token.');
        
      } catch (error) {
        console.error('🔐 Confirmation error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during confirmation.');
      }
    };

    // Small delay to ensure URL has been fully loaded
    const timer = setTimeout(handleEmailConfirmation, 100);
    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleGoToLogin = () => {
    navigate('/manager-auth');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'loading' && <Loader2 className="h-6 w-6 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-6 w-6 text-green-600" />}
            {status === 'error' && <XCircle className="h-6 w-6 text-red-600" />}
            Email Confirmation
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Verifying your email address...'}
            {status === 'success' && 'Your email has been confirmed'}
            {status === 'error' && 'Confirmation failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant={status === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-2">
            {status === 'success' && (
              <Button onClick={() => navigate('/')} className="w-full">
                Go to Home
              </Button>
            )}
            {status === 'error' && (
              <Button onClick={handleGoToLogin} className="w-full">
                Try Logging In
              </Button>
            )}
            <Button variant="outline" onClick={handleReturnHome} className="w-full">
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}