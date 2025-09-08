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

const ManagerAuth = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  const handleAuthAction = async (action: 'signIn' | 'signUp', email: string, password: string, metadata?: any) => {
    // Prevent running during SSG/SSR
    if (typeof window === 'undefined') {
      return { error: { message: 'Server-side execution not supported' } };
    }
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      if (action === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: metadata
          }
        });
        return { error };
      }
    } catch (error) {
      return { error: { message: 'Authentication service unavailable' } };
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log('🔐 Starting manager login process...');
    const { error } = await handleAuthAction('signIn', loginData.email, loginData.password);
    
    if (error) {
      console.error('🔐 Login failed:', error);
      setError(error.message);
      toast.error("Login Failed", {
        description: error.message
      });
    } else {
      console.log('🔐 Login successful, redirecting...');
      toast.success("Welcome back!", {
        description: "You have been successfully logged in."
      });
      // Use navigate instead of window.location for better React Router integration
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
    
    setIsSubmitting(false);
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

    const { error } = await handleAuthAction('signUp', signupData.email, signupData.password, {
      is_manager: true,
      ...metadata
    });
    
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
      
      toast.success("Registration Successful! 🎉", {
        description: "Your manager account has been created. Please check your email to confirm your account and complete the registration process."
      });
    }
    
    setIsSubmitting(false);
  };

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