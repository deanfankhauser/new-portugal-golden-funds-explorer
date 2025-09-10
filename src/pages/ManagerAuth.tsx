import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';

const ManagerAuth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, loading, user } = useEnhancedAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Redirect if already authenticated - wait for hydration to complete
  React.useEffect(() => {
    console.log('🔐 ManagerAuth - Auth state:', { user: !!user, loading, hasUser: !!user });
    // Only redirect if we have a user and we're not loading (fully hydrated)
    if (user && !loading) {
      console.log('🔐 ManagerAuth - Redirecting to home');
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
    companyName: '',
    managerName: '',
    website: '',
    description: ''
  });
  
  // Simple auth functions for form handling
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log('🔐 Starting manager login process with context...');

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
      is_manager: true,
      company_name: signupData.companyName,
      manager_name: signupData.managerName,
      website: signupData.website,
      description: signupData.description
    };

    const { error } = await signUp(signupData.email, signupData.password, 'manager', metadata);
    
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
        companyName: '',
        managerName: '',
        website: '',
        description: ''
      });
      setError(null);
      setRegistrationSuccess(true);
      
      toast.success("Registration Successful! 🎉", {
        description: "Your manager account has been created. Please check your email to confirm your account and complete the registration process."
      });
    }
    
    setIsSubmitting(false);
  };

  // Show success message if registration was successful
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">Registration Successful! 🎉</CardTitle>
            <CardDescription className="text-lg">
              Your manager account has been created. Please check your email to confirm your account and complete the registration process.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200">
                We've sent a confirmation email to <strong>{signupData.email}</strong>
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                Click the link in the email to activate your account and start managing your funds.
              </p>
            </div>
            <Button 
              onClick={() => setRegistrationSuccess(false)} 
              variant="outline" 
              className="w-full"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Manager Portal</CardTitle>
          <CardDescription>
            Access your investment management dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="manager@company.com"
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
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="manager@company.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="manager-name">Manager Name</Label>
                  <Input
                    id="manager-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupData.managerName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, managerName: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    type="text"
                    placeholder="Investment Management Ltd"
                    value={signupData.companyName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, companyName: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://company.com"
                    value={signupData.website}
                    onChange={(e) => setSignupData(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Company Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your investment management services..."
                    value={signupData.description}
                    onChange={(e) => setSignupData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
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

export default ManagerAuth;