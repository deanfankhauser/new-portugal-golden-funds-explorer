import React, { useState, useRef, useEffect } from 'react';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Upload, Loader2, User, Mail, Lock, Camera, Home, Trash2, Edit3 } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import MyEditsSection from '@/components/manager/MyEditsSection';
import { isDevelopment } from '@/lib/environment';

const AccountSettings = () => {
  const { user, profile, updateProfile, uploadAvatar, loading, signOut } = useEnhancedAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile form state
  const [profileData, setProfileData] = useState<Record<string, any>>(() => {
    if (!profile) return {};
    
    const isManager = !!(profile.company_name && profile.manager_name);
    
    if (isManager) {
      return {
        manager_name: profile.manager_name || '',
        company_name: profile.company_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        website: profile.website || '',
        description: profile.description || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
      };
    } else {
      return {
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
        investment_experience: profile.investment_experience || '',
        risk_tolerance: profile.risk_tolerance || '',
        annual_income_range: profile.annual_income_range || '',
        net_worth_range: profile.net_worth_range || '',
      };
    }
  });

  // Update profile data when profile changes
  useEffect(() => {
    if (profile) {
      const isManager = !!(profile.company_name && profile.manager_name);
      
      if (isManager) {
        setProfileData({
          manager_name: profile.manager_name || '',
          company_name: profile.company_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          website: profile.website || '',
          description: profile.description || '',
          address: profile.address || '',
          city: profile.city || '',
          country: profile.country || '',
        });
      } else {
        setProfileData({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          city: profile.city || '',
          country: profile.country || '',
          investment_experience: profile.investment_experience || '',
          risk_tolerance: profile.risk_tolerance || '',
          annual_income_range: profile.annual_income_range || '',
          net_worth_range: profile.net_worth_range || '',
        });
      }
    }
  }, [profile]);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // DEV MODE BYPASS - skip auth check in preview/localhost
  if (!user && !isDevelopment()) {
    return <Navigate to="/auth" replace />;
  }

  const getDisplayName = () => {
    if (!profile) return user.email?.split('@')[0] || 'User';
    
    const isManager = !!(profile.company_name && profile.manager_name);
    if (isManager) {
      return profile.manager_name || 'Manager';
    }
    return `${profile.first_name} ${profile.last_name}` || 'Investor';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarUrl = () => {
    if (profile && 'avatar_url' in profile) {
      return profile.avatar_url;
    }
    if (profile && 'logo_url' in profile) {
      return (profile as any).logo_url;
    }
    return undefined;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const { error } = await updateProfile(profileData);
    
    if (error) {
      toast.error("Update Failed", {
        description: error.message
      });
    } else {
      toast.success("Profile Updated", {
        description: "Your profile has been successfully updated."
      });
    }
    
    setIsUpdating(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Invalid File", {
        description: "Please select an image file."
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File Too Large", {
        description: "Please select an image smaller than 5MB."
      });
      return;
    }

    setIsUploadingAvatar(true);

    const { error } = await uploadAvatar(file);
    
    if (error) {
      toast.error("Upload Failed", {
        description: error.message
      });
    } else {
      toast.success("Photo Updated", {
        description: "Your profile photo has been updated."
      });
    }
    
    setIsUploadingAvatar(false);
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔑 Password change initiated, user:', user?.email, 'loading:', loading);

    // reset status
    setPasswordChangeStatus('idle');
    setPasswordChangeMessage('');
    
    // Check if user is authenticated
    if (!user) {
      console.log('🔑 No authenticated user found');
      toast.error("Authentication Error", {
        description: "You must be logged in to change your password."
      });
      return;
    }
    
    // Validate inputs before setting loading state
    if (!passwordData.currentPassword) {
      toast.error("Current Password Required", {
        description: "Please enter your current password."
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Password Mismatch", {
        description: "New passwords don't match."
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Weak Password", {
        description: "Password must be at least 6 characters long."
      });
      return;
    }

    setIsUpdatingPassword(true);
    console.log('🔑 Starting password update for user:', user.email);

    // Listen for auth events to detect success even if the promise takes long
    let finished = false;
    const { data: authSub } = supabase.auth.onAuthStateChange((event) => {
      console.log('🔑 Auth event during password change:', event);
      if (!finished && (event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED')) {
        finished = true;
        setIsUpdatingPassword(false);
        setPasswordChangeStatus('success');
        setPasswordChangeMessage('Your password has been successfully updated.');
        toast.success("Password Changed", {
          description: "Your password has been successfully updated."
        });
        // Clear the form
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        authSub.subscription.unsubscribe();
        if (timeoutId) clearTimeout(timeoutId);
      }
    });

    // Soft timeout to avoid a stuck spinner, but don't show error
    let timeoutId: any = setTimeout(() => {
      if (finished) return;
      console.warn('🔑 Password update taking longer than expected');
      setIsUpdatingPassword(false);
      toast('Still processing… If your password was updated, you may be asked to re-login.');
    }, 20000);

    try {
      console.log('🔑 Calling supabase.auth.updateUser');
      const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });

      if (finished) return; // already handled by auth event
      if (timeoutId) clearTimeout(timeoutId);
      authSub.subscription.unsubscribe();

      if (error) {
        console.log('🔑 Password update failed:', error.message);
        setPasswordChangeStatus('error');
        setPasswordChangeMessage(error.message);
        toast.error("Password Update Failed", { description: error.message });
      } else {
        console.log('🔑 Password update successful (no auth event)');
        setPasswordChangeStatus('success');
        setPasswordChangeMessage('Your password has been successfully updated.');
        toast.success("Password Changed", { description: "Your password has been successfully updated." });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      authSub.subscription.unsubscribe();
      console.error('🔑 Password update error:', error);
      setPasswordChangeStatus('error');
      setPasswordChangeMessage('An unexpected error occurred. Please try again.');
      toast.error("Update Failed", { description: "An unexpected error occurred. Please try again." });
    } finally {
      console.log('🔑 Setting isUpdatingPassword to false');
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    console.log('🗑️ Delete account initiated, user:', user?.email);
    
    // Check if user is authenticated
    if (!user) {
      console.log('🗑️ No authenticated user found');
      toast.error("Authentication Error", {
        description: "You must be logged in to delete your account."
      });
      return;
    }
    
    setIsDeletingAccount(true);
    console.log('🗑️ Starting account deletion for user:', user.email);
    
    try {
      // supabase client statically imported above
      
      // Safety timeout to avoid stuck loading
      let timeoutId: any = setTimeout(() => {
        console.warn('🗑️ Delete account timed out');
        setIsDeletingAccount(false);
        toast.error("Delete Failed", { description: "Request timed out. Please try again." });
      }, 20000);
      
      // Get the current session to include in the request
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        clearTimeout(timeoutId);
        throw new Error('No valid session found');
      }
      
      console.log('🗑️ Calling delete-account edge function');
      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: {},
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      if (error) {
        console.error('🗑️ Delete account error:', error);
        toast.error("Delete Failed", {
          description: error.message || "Unable to delete account. Please contact support."
        });
        return;
      }
      
      console.log('🗑️ Account deletion successful:', data);
      toast.success("Account Deleted", {
        description: "Your account has been permanently deleted."
      });
      
      // Sign out and redirect
      console.log('🗑️ Signing out and redirecting');
      await signOut();
      navigate('/');
      
    } catch (error) {
      console.error('🗑️ Delete account error:', error);
      toast.error("Delete Failed", {
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      console.log('🗑️ Setting isDeletingAccount to false');
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Account Settings</h1>
                <p className="text-muted-foreground">
                  Manage your profile information and account preferences
                </p>
              </div>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue={searchParams.get('tab') || "profile"} className="space-y-6">
            <TabsList className={`grid w-full ${profile && profile.company_name && profile.manager_name ? 'grid-cols-4' : 'grid-cols-3'}`}>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              {profile && profile.company_name && profile.manager_name && (
                <TabsTrigger value="edits">My Edits</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and profile photo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={getAvatarUrl()} alt={getDisplayName()} />
                      <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Profile Photo</p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or GIF. Max size 5MB.
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                      >
                        {isUploadingAvatar ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Camera className="mr-2 h-4 w-4" />
                            Change Photo
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Profile Form */}
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    {profile && profile.company_name && profile.manager_name ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="manager_name">Manager Name</Label>
                            <Input
                              id="manager_name"
                              value={profileData.manager_name || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, manager_name: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company_name">Company Name</Label>
                            <Input
                              id="company_name"
                              value={profileData.company_name || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, company_name: e.target.value }))}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={profileData.phone || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            type="url"
                            value={profileData.website || ''}
                            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={profileData.description || ''}
                            onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              value={profileData.address || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={profileData.city || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              value={profileData.country || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                              id="first_name"
                              value={profileData.first_name || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                              id="last_name"
                              value={profileData.last_name || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={profileData.phone || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="investment_experience">Investment Experience</Label>
                            <Select 
                              value={profileData.investment_experience || ''} 
                              onValueChange={(value) => setProfileData(prev => ({ ...prev, investment_experience: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                              <SelectContent className="z-[9999]">
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                                <SelectItem value="professional">Professional</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="risk_tolerance">Risk Tolerance</Label>
                            <Select 
                              value={profileData.risk_tolerance || ''} 
                              onValueChange={(value) => setProfileData(prev => ({ ...prev, risk_tolerance: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select risk tolerance" />
                              </SelectTrigger>
                              <SelectContent className="z-[9999]">
                                <SelectItem value="conservative">Conservative</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="aggressive">Aggressive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              value={profileData.address || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={profileData.city || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              value={profileData.country || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter your current password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter your new password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                      <Input
                        id="confirm-new-password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm your new password"
                      />
                    </div>
                    
                    <Button type="submit" disabled={isUpdatingPassword}>
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </Button>
                  </form>
                  {passwordChangeStatus !== 'idle' && (
                    <Alert variant={passwordChangeStatus === 'error' ? 'destructive' : 'success'} className="mt-2">
                      <AlertDescription>{passwordChangeMessage}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Separator className="my-8" />
                  
                  {/* Danger Zone */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground">
                        Irreversible and destructive actions
                      </p>
                    </div>
                    
                    <Card className="border-destructive/20 bg-destructive/5">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium text-destructive">Delete Account</h4>
                            <p className="text-sm text-muted-foreground">
                              Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                          </div>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="ml-4">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-destructive">
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="space-y-2">
                                  <p>
                                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                                  </p>
                                  <p className="font-medium text-destructive">
                                    All of the following will be permanently deleted:
                                  </p>
                                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                                    <li>Your profile information</li>
                                    <li>All uploaded photos and documents</li>
                                    <li>Account preferences and settings</li>
                                    <li>All associated data</li>
                                  </ul>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteAccount}
                                  disabled={isDeletingAccount}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {isDeletingAccount ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete Account Permanently
                                    </>
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your experience and notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Preference settings will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {profile && profile.company_name && profile.manager_name && (
              <TabsContent value="edits">
                <MyEditsSection />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;