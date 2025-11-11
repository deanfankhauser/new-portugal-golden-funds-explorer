import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Building2, BarChart3, Users, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Profile } from '@/types/profile';
import ProfileEditTab from '@/components/manager-profile/ProfileEditTab';
import ProfileAnalyticsTab from '@/components/manager-profile/ProfileAnalyticsTab';
import { PageLoader } from '@/components/common/LoadingSkeleton';

const ManageProfile: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useEnhancedAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [permissions, setPermissions] = useState({
    can_edit_profile: false,
    can_edit_funds: false,
    can_manage_team: false,
    can_view_analytics: false,
  });

  useEffect(() => {
    const checkAccessAndLoadProfile = async () => {
      console.log('[ManageProfile] init', { profileId, userId: user?.id });

      if (!user || !profileId) {
        setLoading(false);
        return;
      }

      try {
        // Check if user has access to edit this profile
        let access = false;
        let userPermissions = {
          can_edit_profile: false,
          can_edit_funds: false,
          can_manage_team: false,
          can_view_analytics: false,
        };

        try {
          const { data: canEdit, error: permError } = await supabase.rpc('can_user_edit_profile', {
            p_user_id: user.id,
            p_profile_id: profileId,
          });
          if (permError) throw permError;
          access = !!canEdit;
          console.log('[ManageProfile] RPC can_user_edit_profile result', { access });
        } catch (e) {
          console.warn('[ManageProfile] RPC failed, falling back to manager_profile_assignments', e);
        }

        // Get detailed permissions
        if (access) {
          const { data: assignment, error: assignError } = await supabase
            .from('manager_profile_assignments')
            .select('permissions')
            .eq('user_id', user.id)
            .eq('profile_id', profileId)
            .eq('status', 'active')
            .maybeSingle();

          if (!assignError && assignment) {
            userPermissions = assignment.permissions as any;
            console.log('[ManageProfile] User permissions', userPermissions);
          }
        }

        setHasAccess(access);
        setPermissions(userPermissions);

        if (!access) {
          console.warn('[ManageProfile] No access to this profile', { profileId });
          return;
        }

        // Load profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profileData) {
          console.error('[ManageProfile] Profile not found', { profileId });
          return;
        }

        console.log('[ManageProfile] Profile loaded', profileData);
        setProfile(profileData as Profile);
      } catch (error: any) {
        console.error('[ManageProfile] Error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAccessAndLoadProfile();
  }, [user, profileId]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  if (authLoading || loading) {
    return <PageLoader />;
  }

  if (!user) {
    return null; // Will redirect via effect
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to manage this profile. Contact an administrator if you believe this is an error.
              </AlertDescription>
            </Alert>
            <div className="mt-6 flex justify-center">
              <Button onClick={() => navigate('/')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Profile not found or has been deleted.
              </AlertDescription>
            </Alert>
            <div className="mt-6 flex justify-center">
              <Button onClick={() => navigate('/')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-4 mb-2">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-gray-900">
                Manage Profile: {profile.company_name}
              </h1>
            </div>
            <p className="text-gray-600">
              Update your company profile information and manage your team
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="edit" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Edit Profile
              </TabsTrigger>
              {permissions.can_view_analytics && (
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="edit">
              {permissions.can_edit_profile ? (
                <ProfileEditTab
                  profile={profile}
                  onProfileUpdate={(updatedProfile) => setProfile(updatedProfile)}
                  canManageTeam={permissions.can_manage_team}
                />
              ) : (
                <Card className="p-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You don't have permission to edit this profile. Your access is view-only.
                    </AlertDescription>
                  </Alert>
                </Card>
              )}
            </TabsContent>

            {permissions.can_view_analytics && (
              <TabsContent value="analytics">
                <ProfileAnalyticsTab profileId={profile.id!} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ManageProfile;