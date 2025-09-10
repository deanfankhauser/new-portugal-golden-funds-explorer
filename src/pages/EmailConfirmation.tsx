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
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (!token || !type) {
          setStatus('error');
          setMessage('Invalid confirmation link. Missing required parameters.');
          return;
        }

        // Handle different types of email confirmations
        if (type === 'signup') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email'
          });

          if (error) {
            console.error('Email confirmation error:', error);
            setStatus('error');
            setMessage(error.message || 'Failed to confirm email. The link may have expired.');
          } else {
            setStatus('success');
            setMessage('Email confirmed successfully! You can now log in to your account.');
            toast.success('Email Confirmed', {
              description: 'Your email has been verified successfully!'
            });
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
              navigate('/manager-auth'); // Default to manager auth, could be improved
            }, 3000);
          }
        } else if (type === 'recovery') {
          // Handle password recovery
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery'
          });

          if (error) {
            console.error('Password recovery error:', error);
            setStatus('error');
            setMessage(error.message || 'Failed to verify recovery link. The link may have expired.');
          } else {
            setStatus('success');
            setMessage('Recovery link verified! You can now reset your password.');
            // Redirect to password reset page
            setTimeout(() => {
              navigate('/reset-password');
            }, 2000);
          }
        } else {
          setStatus('error');
          setMessage('Unknown confirmation type.');
        }
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
              <Button onClick={handleGoToLogin} className="w-full">
                Go to Login
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