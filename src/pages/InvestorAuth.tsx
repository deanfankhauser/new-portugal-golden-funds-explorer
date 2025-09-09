import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { signIn, signUp, loading, user } = useEnhancedAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated - wait for hydration to complete
  React.useEffect(() => {
    console.log('🔐 InvestorAuth - Auth state:', { user: !!user, loading, hasUser: !!user });
    // Only redirect if we have a user and we're not loading (fully hydrated)
    if (user && !loading) {
      console.log('🔐 InvestorAuth - Redirecting to home');
      navigate('/');
    }
  }, [user, loading, navigate]);

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
        setError(error.message);
        toast.error("Login Failed", {
          description: error.message
        });
        setIsSubmitting(false);
      } else {
        console.log('🔐 Login successful, checking auth state...');
        toast.success("Welcome back!", {
          description: "You have been successfully logged in."
        });
        
        // Wait for auth state to update, then redirect
        setTimeout(() => {
          if (user) {
            console.log('🔐 User detected, redirecting...');
            navigate('/');
          } else {
            console.log('🔐 User not detected yet, waiting longer...');
            // Wait a bit more for auth state to propagate
            setTimeout(() => {
              setIsSubmitting(false);
              if (!user) {
                console.log('🔐 Auth state not updated, but login was successful - redirecting anyway');
                navigate('/');
              }
            }, 2000);
          }
        }, 1000);
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
      
      toast.success("Registration Successful! 🎉", {
        description: "Your investor account has been created. Please check your email to confirm your account."
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Investor Portal</CardTitle>
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
  );
};

export default InvestorAuth;