import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Check if we have reset tokens in URL on mount
  React.useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const searchParams = new URLSearchParams(window.location.search);
    
    // Check for Supabase recovery tokens (from built-in auth)
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');
    
    // Check for custom reset token (from our custom function)
    const customToken = searchParams.get('token');
    const tokenEmail = searchParams.get('email');
    
    if (accessToken && refreshToken && type === 'recovery') {
      // User clicked Supabase recovery link, set session and go to reset step
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ error }) => {
        if (!error) {
          setStep('reset');
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      });
    } else if (customToken && tokenEmail) {
      // User clicked custom reset link - validate token and proceed
      console.log('Custom reset token detected:', customToken);
      // For now, just proceed to reset step
      // TODO: Validate token with backend if needed
      setStep('reset');
      setEmail(decodeURIComponent(tokenEmail));
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Use environment-aware URL to call the correct project's edge function
      const config = (await import('@/lib/supabase-config')).getSupabaseConfig();
      const FUNCTION_URL = `${config.url}/functions/v1/send-password-reset`;
      
      const resp = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          redirectTo: `${window.location.origin}/reset-password`
        })
      });

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({}));
        console.error('Custom email error:', errJson);
        // Fallback to Supabase's built-in method
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        
        if (error) {
          setError(error.message);
        } else {
          toast.success('Reset Email Sent', {
            description: 'Check your email for password reset instructions (via Supabase)'
          });
          setStatus('success');
        }
      } else {
        toast.success('Reset Email Sent', {
          description: 'Check your email for password reset instructions'
        });
        setStatus('success');
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      
      // Final fallback to Supabase built-in method
      try {
        const { error: fallbackError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        
        if (fallbackError) {
          setError('Unable to send reset email. Please try again later.');
        } else {
          toast.success('Reset Email Sent', {
            description: 'Check your email for password reset instructions'
          });
          setStatus('success');
        }
      } catch (fallbackErr) {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword
      });

      if (error) {
        setError(error.message);
      } else {
        toast.success('Password Updated', {
          description: 'Your password has been successfully updated!'
        });
        setStatus('success');
        setPasswords({ newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {step === 'request' ? 'Reset Password' : 'Set New Password'}
          </CardTitle>
          <CardDescription>
            {step === 'request' 
              ? 'Enter your email address and we\'ll send you a reset link'
              : 'Enter your new password below'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'success' && step === 'request' ? (
            <div className="space-y-4 text-center">
              <Alert>
                <AlertDescription>
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Check your email and follow the instructions to reset your password.
                </AlertDescription>
              </Alert>
              <Button variant="outline" className="w-full" onClick={() => navigate('/')}> 
                Back to Home
              </Button>
            </div>
          ) : status === 'success' && step === 'reset' ? (
            <div className="space-y-4 text-center">
              <Alert>
                <AlertDescription>
                  Your password has been updated successfully. You can now log in with your new password.
                </AlertDescription>
              </Alert>
              <Button className="w-full" onClick={() => navigate('/manager-auth')}>
                Go to Login
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/')}> 
                Back to Home
              </Button>
            </div>
          ) : step === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
              
              <div className="text-center">
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-sm"
                  onClick={() => navigate('/manager-auth')}
                >
                  Back to Login
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}