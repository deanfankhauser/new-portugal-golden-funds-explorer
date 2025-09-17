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
        // Supabase sends auth data in URL hash, not query params
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = searchParams;
        
        // Try to get token (token_hash) and type from either hash or query params
        const token = hashParams.get('access_token') || 
                     hashParams.get('token') || 
                     hashParams.get('token_hash') ||
                     queryParams.get('token') ||
                     queryParams.get('token_hash');
        const type = hashParams.get('type') || queryParams.get('type') || 'signup';
        
        console.log('Confirmation params:', { 
          hash: window.location.hash, 
          search: window.location.search,
          token: token ? 'present' : 'missing',
          type 
        });
        
        if (!token) {
          setStatus('error');
          setMessage('Invalid confirmation link. Missing authentication token.');
          return;
        }

        // Handle different types and token formats from Supabase
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const errorCode = hashParams.get('error_code') || queryParams.get('error_code');
        const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');

        // Explicit error returned in URL
        if (errorCode) {
          console.error('Confirmation error from URL:', errorCode, errorDescription);
          setStatus('error');
          setMessage(
            errorCode === 'otp_expired'
              ? 'This confirmation link has expired. Please request a new email.'
              : errorDescription || 'Failed to confirm email. The link may be invalid or expired.'
          );
          return;
        }

        // New flow: access_token + refresh_token in hash → directly set session
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('setSession error:', error);
            setStatus('error');
            setMessage(error.message || 'Failed to establish session from confirmation link.');
          } else {
            // Clean URL to remove sensitive tokens
            try { window.history.replaceState({}, document.title, window.location.pathname); } catch {}

            if (type === 'recovery') {
              setStatus('success');
              setMessage('Recovery link verified! You can now reset your password.');
              setTimeout(() => navigate('/reset-password'), 1500);
            } else {
              // Send welcome email for new confirmations
              try {
                const { data: session } = await supabase.auth.getSession();
                if (session?.session?.user?.email) {
                  await supabase.functions.invoke('send-welcome-email', {
                    body: {
                      email: session.session.user.email,
                      loginUrl: `${window.location.origin}/`
                    }
                  });
                }
              } catch (welcomeError) {
                console.log('Welcome email failed (non-critical):', welcomeError);
              }

              setStatus('success');
              setMessage('Email confirmed successfully! Welcome to your account.');
              toast.success('Email Confirmed', { description: 'Your email has been verified successfully!' });
              setTimeout(() => navigate('/'), 2000); // Redirect to home page
            }
          }
          return;
        }

        // Legacy flow: verify OTP token when provided
        if (token && (type === 'signup' || type === 'recovery')) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: type as 'signup' | 'recovery',
          });

          if (error) {
            console.error('verifyOtp error:', error);
            setStatus('error');
            setMessage(error.message || 'Failed to verify the link. It may have expired.');
          } else {
            if (type === 'recovery') {
              setStatus('success');
              setMessage('Recovery link verified! You can now reset your password.');
              setTimeout(() => navigate('/reset-password'), 1500);
            } else {
              setStatus('success');
              setMessage('Email confirmed successfully! Welcome to your account.');
              toast.success('Email Confirmed', { description: 'Your email has been verified successfully!' });
              setTimeout(() => navigate('/'), 2000); // Redirect to home page
            }
          }
          return;
        }

        setStatus('error');
        setMessage('Unknown confirmation type or missing parameters.');
      } catch (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during confirmation.');
      }
    };

    handleEmailConfirmation();
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