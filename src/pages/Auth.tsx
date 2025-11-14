import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useInvitationValidation, useInvitationAcceptance } from '@/hooks/useInvitationAcceptance';
import { InvitationBanner } from '@/components/auth/InvitationBanner';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp, signOut } = useEnhancedAuth();
  
  // Invitation handling
  const invitationToken = searchParams.get('invite');
  const { isValidating, invitation, error: invitationError } = useInvitationValidation(invitationToken);
  const { acceptInvitation, isAccepting } = useInvitationAcceptance();
  const [activeTab, setActiveTab] = useState('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Signup state
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  
  // Pre-fill email from invitation and switch to signup tab
  useEffect(() => {
    if (invitation?.email) {
      setSignupEmail(invitation.email);
      setActiveTab('signup');
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const { error } = await signIn(loginEmail, loginPassword);
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setLoginError('Please check your email and confirm your account before logging in.');
          setNeedsConfirmation(true);
        } else if (error.message.includes('Invalid login credentials')) {
          setLoginError('Invalid email or password. Please try again.');
        } else {
          setLoginError(error.message);
        }
      } else {
        toast.success('Successfully signed in!');
        navigate('/');
      }
    } catch (error: any) {
      setLoginError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    // Validation
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters long');
      return;
    }
    
    // Validate email matches invitation if present
    if (invitation && signupEmail !== invitation.email) {
      setSignupError(`Please use the invited email address: ${invitation.email}`);
      return;
    }

    setSignupLoading(true);

    try {
      const { error } = await signUp(signupEmail, signupPassword, {
        first_name: signupFirstName.trim(),
        last_name: signupLastName.trim(),
        invitation_token: invitationToken || undefined,
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setSignupError('This email is already registered. Please login instead.');
        } else {
          setSignupError(error.message);
        }
      } else {
        setShowSuccessMessage(true);
        const message = invitationToken 
          ? 'Account created! Please check your email to confirm and complete your team invitation.'
          : 'Account created! Please check your email to confirm your account.';
        toast.success(message);
      }
    } catch (error: any) {
      setSignupError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setSignupLoading(false);
    }
  };
  
  // Note: Invitation acceptance is now handled automatically by the database trigger
  // when the user signs up with an invitation_token in their metadata.
  // The trigger creates the profile AND assigns the user to the company automatically.

  if (showSuccessMessage) {
    return (
      <>
        <Helmet>
          <title>Registration Successful | FundsPortugal.com</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Check Your Email</CardTitle>
              <CardDescription>We've sent you a confirmation link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  We've sent a confirmation email to <strong>{signupEmail}</strong>. 
                  Please check your inbox and click the confirmation link to activate your account.
                </AlertDescription>
              </Alert>
              <Button onClick={() => navigate('/')} className="w-full">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login / Register | FundsPortugal.com</title>
        <meta name="description" content="Sign in or create an account to access personalized features, save funds, and manage your portfolio." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <div className="container mx-auto px-4 py-16">
        {isValidating && (
          <div className="max-w-2xl mx-auto mb-6 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Validating invitation...</span>
          </div>
        )}
        
        {invitation && (
          <div className="max-w-2xl mx-auto mb-6">
            <InvitationBanner
              companyName={invitation.companyName}
              inviterName={invitation.inviterName}
              personalMessage={invitation.personalMessage}
              expiresAt={invitation.expiresAt}
              email={invitation.email}
            />
          </div>
        )}
        
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              {invitation ? 'Complete your signup to join the team' : 'Sign in or create an account to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {invitation && (
                    <Alert>
                      <AlertDescription>
                        You have a team invitation. Please use the <strong>Sign Up</strong> tab to create your account with the invited email address.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={loginLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={loginLoading}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 text-sm"
                      onClick={() => navigate('/reset-password')}
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button type="submit" className="w-full" disabled={loginLoading}>
                    {loginLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  {signupError && (
                    <Alert variant="destructive">
                      <AlertDescription>{signupError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstname">First Name</Label>
                      <Input
                        id="signup-firstname"
                        type="text"
                        placeholder="John"
                        value={signupFirstName}
                        onChange={(e) => setSignupFirstName(e.target.value)}
                        required
                        disabled={signupLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastname">Last Name</Label>
                      <Input
                        id="signup-lastname"
                        type="text"
                        placeholder="Doe"
                        value={signupLastName}
                        onChange={(e) => setSignupLastName(e.target.value)}
                        required
                        disabled={signupLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={signupLoading}
                      readOnly={!!invitation}
                      className={invitation ? 'bg-muted' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={signupLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={signupLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={signupLoading}>
                    {signupLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default Auth;
