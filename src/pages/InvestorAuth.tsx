import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';

const InvestorAuth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signOut, loading, user } = useEnhancedAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [lastSignupEmail, setLastSignupEmail] = useState('');

  // If already authenticated, show options instead of redirecting
  if (user && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              <h1>You're already signed in</h1>
            </CardTitle>
            <CardDescription>Use the options below to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={() => navigate('/')}>Go to Home</Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/account-settings')}>Account Settings</Button>
            <Button 
              variant="secondary" 
              className="w-full" 
              onClick={async () => { 
                const { error } = await signOut(); 
                if (!error) { 
                  toast.success('Signed out'); 
                } else { 
                  toast.error('Sign out failed', { description: error.message }); 
                }
              }}
            >
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    investmentExperience: '',
    riskTolerance: ''
  });
  
  // Simple auth functions for form handling
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log('🔐 Starting investor login process with context...');

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        console.error('🔐 Login failed:', error);
        
        // Handle specific error types
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          setError('Please confirm your email address before logging in.');
          setShowResendConfirmation(true);
          setLastSignupEmail(loginData.email);
          toast.error("Email Not Confirmed", {
            description: "Please check your email and click the confirmation link."
          });
        } else {
          setError(error.message);
          setShowResendConfirmation(false);
          toast.error("Login Failed", {
            description: error.message
          });
        }
        setIsSubmitting(false);
      } else {
        console.log('🔐 Login successful, redirecting to home...');
        toast.success("Welcome back!", {
          description: "You have been successfully logged in."
        });
        
        // Navigate immediately after successful login
        navigate('/');
      }
    } catch (error) {
      console.error('🔐 Login process failed:', error);
      setError('Login failed unexpectedly. Please try again.');
      toast.error("Login Error", {
        description: "An unexpected error occurred. Please try again."
      });
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords don't match");
      setIsSubmitting(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    const metadata = {
      first_name: signupData.firstName,
      last_name: signupData.lastName,
      investment_experience: signupData.investmentExperience,
      risk_tolerance: signupData.riskTolerance
    };

    const { error } = await signUp(signupData.email, signupData.password, 'investor', metadata);
    
    if (error) {
      if (error.message.includes('already registered')) {
        setError('This email is already registered. Please try logging in instead.');
        toast.error("Registration Failed", {
          description: "This email is already registered. Please try logging in instead."
        });
      } else if (error.message.includes('email')) {
        setError('Please enter a valid email address.');
        toast.error("Invalid Email", {
          description: "Please enter a valid email address."
        });
      } else if (error.message.includes('password')) {
        setError('Password must be at least 6 characters long.');
        toast.error("Weak Password", {
          description: "Password must be at least 6 characters long."
        });
      } else {
        setError(error.message);
        toast.error("Registration Failed", {
          description: error.message
        });
      }
    } else {
      // Clear form and show success message
      setSignupData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        investmentExperience: '',
        riskTolerance: ''
      });
      setError(null);
      setLastSignupEmail(signupData.email);
      
      toast.success("Registration Successful! 🎉", {
        description: "Please check your email to confirm your account before logging in."
      });
    }
    
    setIsSubmitting(false);
  };

  // Function to resend confirmation email
  const handleResendConfirmation = async () => {
    if (!lastSignupEmail) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: lastSignupEmail
      });
      
      if (error) {
        toast.error("Failed to resend", { description: error.message });
      } else {
        toast.success("Email Sent", { 
          description: "Please check your email for the confirmation link." 
        });
        setShowResendConfirmation(false);
      }
    } catch (err) {
      toast.error("Failed to resend confirmation email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Investor Portal - Login & Register | Movingto</title>
        <meta name="description" content="Access your investor account to explore top investment opportunities. Join thousands of investors discovering the best funds with Movingto's investor portal." />
        <link rel="canonical" href="https://fundguide.movingto.org/investor-auth" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Investor Portal - Login & Register | Movingto" />
        <meta property="og:description" content="Access your investor account to explore top investment opportunities. Join thousands of investors discovering the best funds with Movingto's investor portal." />
        <meta property="og:url" content="https://fundguide.movingto.org/investor-auth" />
        <meta property="og:image" content="https://fundguide.movingto.org/lovable-uploads/ab17d046-1cb9-44fd-aa6d-c4d338e11090.png" />
        <meta property="og:type" content="website" />
        
        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Investor Portal - Login & Register",
            "description": "Access your investor account to explore top investment opportunities. Join thousands of investors discovering the best funds with Movingto's investor portal.",
            "url": "https://fundguide.movingto.org/investor-auth",
            "isPartOf": {
              "@type": "WebSite",
              "name": "Movingto Fund Guide",
              "url": "https://fundguide.movingto.org"
            },
            "mainEntity": {
              "@type": "Service",
              "name": "Investor Portal",
              "description": "Secure login and registration portal for investment fund access",
              "provider": {
                "@type": "Organization",
                "name": "Movingto"
              }
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            <h1>Investor Portal</h1>
          </CardTitle>
          <CardDescription>
            Join thousands of investors exploring top investment opportunities
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="investor@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {showResendConfirmation && (
                  <Alert>
                    <AlertDescription className="space-y-2">
                      <p>Haven't received the confirmation email?</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResendConfirmation}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Resend Confirmation Email'}
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
                
                <div className="text-center">
                  <Button 
                    type="button" 
                    variant="link" 
                    className="text-sm text-muted-foreground"
                    onClick={() => navigate('/reset-password')}
                  >
                    Forgot your password?
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      type="text"
                      placeholder="John"
                      value={signupData.firstName}
                      onChange={(e) => setSignupData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      type="text"
                      placeholder="Doe"
                      value={signupData.lastName}
                      onChange={(e) => setSignupData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="investor@email.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="investment-experience">Investment Experience</Label>
                  <Select 
                    value={signupData.investmentExperience} 
                    onValueChange={(value) => setSignupData(prev => ({ ...prev, investmentExperience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                  <SelectContent className="z-[9999]">
                      <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
                  <Select 
                    value={signupData.riskTolerance} 
                    onValueChange={(value) => setSignupData(prev => ({ ...prev, riskTolerance: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your risk tolerance" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
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
    </>
  );
};

export default InvestorAuth;