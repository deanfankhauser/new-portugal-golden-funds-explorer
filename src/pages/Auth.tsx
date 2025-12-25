import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useInvitationValidation } from '@/hooks/useInvitationAcceptance';
import { InvitationBanner } from '@/components/auth/InvitationBanner';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, sendMagicLink, signOut } = useEnhancedAuth();
  
  // Invitation handling
  const invitationToken = searchParams.get('invite');
  console.log('🎫 Auth page loaded with invitation token:', invitationToken);
  const { isValidating, invitation, error: invitationError } = useInvitationValidation(invitationToken);

  // Form state
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSentEmail, setLastSentEmail] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  
  // Pre-fill email from invitation
  useEffect(() => {
    if (invitation?.email) {
      setEmail(invitation.email);
    }
  }, [invitation]);
  
  // Show error for invalid invitations
  useEffect(() => {
    if (invitationError) {
      toast.error('Invalid Invitation', {
        description: invitationError,
      });
    }
  }, [invitationError]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining(cooldownRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

  // Already logged in
  if (user) {
    return (
      <>
        <Helmet>
          <title>Account | FundsPortugal.com</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>You're already logged in</CardTitle>
              <CardDescription>Welcome back! You're currently signed in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate('/')} className="w-full">
                Go to Home
              </Button>
              <Button onClick={() => navigate('/account-settings')} variant="outline" className="w-full">
                Account Settings
              </Button>
              <Button onClick={signOut} variant="ghost" className="w-full">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address');
        setIsSubmitting(false);
        return;
      }

      const metadata = {
        first_name: firstName,
        last_name: lastName,
        invitation_token: invitationToken || undefined,
      };

      const { error } = await sendMagicLink(email, metadata);
      
      if (error) {
        console.error('Magic link error:', error);
        if (error.message?.includes('rate limit')) {
          setError('Too many requests. Please wait a moment before trying again.');
        } else {
          setError(error.message || 'Failed to send magic link. Please try again.');
        }
        toast.error('Error', {
          description: error.message || 'Failed to send magic link',
        });
      } else {
        setShowSuccess(true);
        setLastSentEmail(email);
        setCooldownRemaining(60);
        toast.success('Check your email!', {
          description: 'We\'ve sent you a magic link to sign in.',
        });
      }
    } catch (err: any) {
      console.error('Exception sending magic link:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('Error', {
        description: 'Failed to send magic link',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldownRemaining > 0) {
      toast.error('Please wait', {
        description: `You can resend in ${cooldownRemaining} seconds`,
      });
      return;
    }
    
    setShowSuccess(false);
    // The form will be shown again, user can click send
  };

  return (
    <>
      <Helmet>
        <title>Sign In | FundsPortugal.com</title>
        <meta name="description" content="Sign in to access your FundsPortugal.com account" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            {invitation && <InvitationBanner 
              companyName={invitation.companyName}
              inviterName={invitation.inviterName}
              personalMessage={invitation.personalMessage}
              expiresAt={invitation.expiresAt}
              email={invitation.email}
            />}
            
            {isValidating ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
              </Card>
            ) : showSuccess ? (
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle>Check Your Email</CardTitle>
                  <CardDescription>
                    We've sent a magic link to <strong>{lastSentEmail}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-foreground">Click the link to sign in</p>
                        <p className="text-muted-foreground">The link is valid for 1 hour and can only be used once.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Didn't receive the email?
                  </div>
                  
                  <Button 
                    onClick={handleResend} 
                    variant="outline" 
                    className="w-full"
                    disabled={cooldownRemaining > 0}
                  >
                    {cooldownRemaining > 0 
                      ? `Resend in ${cooldownRemaining}s` 
                      : 'Resend Magic Link'
                    }
                  </Button>
                  
                  <Button 
                    onClick={() => setShowSuccess(false)} 
                    variant="ghost" 
                    className="w-full"
                  >
                    Use a different email
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Sign In or Sign Up</CardTitle>
                  <CardDescription>
                    Enter your email and we'll send you a magic link to sign in instantly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendMagicLink} className="space-y-4">
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
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting || !!invitation?.email}
                        required
                      />
                      {invitation?.email && (
                        <p className="text-sm text-muted-foreground">
                          Email is pre-filled from your invitation
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name (Optional)</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name (Optional)</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Magic Link...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Magic Link
                        </>
                      )}
                    </Button>

                    <div className="rounded-lg border border-border bg-muted/50 p-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        No password needed. We'll email you a secure link to sign in.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Auth;
