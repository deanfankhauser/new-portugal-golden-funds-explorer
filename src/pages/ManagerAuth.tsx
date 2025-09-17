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
  const { signIn, signUp, signOut, loading, user } = useEnhancedAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [lastSignupEmail, setLastSignupEmail] = useState('');

  // If already authenticated, show options instead of redirecting
  if (user && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">You're already signed in</CardTitle>
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

  // Show success message if registration was successful
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">Registration Successful! 🎉</CardTitle>
            <CardDescription className="text-lg">
              Please check your email to confirm your account before logging in.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200">
                Your account <strong>{lastSignupEmail}</strong> has been created successfully!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                Please check your email and click the confirmation link to activate your account.
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