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
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');
    
    if (accessToken && refreshToken && type === 'recovery') {
      // User clicked recovery link, set session and go to reset step
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
    }
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        setError(error.message);
      } else {
        toast.success('Reset Email Sent', {
          description: 'Check your email for password reset instructions'
        });
        setStatus('success');
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      setError('An unexpected error occurred');
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