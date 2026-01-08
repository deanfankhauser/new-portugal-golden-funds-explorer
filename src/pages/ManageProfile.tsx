import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Building2, Loader2, AlertCircle, ArrowLeft, Users, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import FundManagerSidebar from '@/components/fund-manager/FundManagerSidebar';
import { Profile } from '@/types/profile';
import ProfileEditTab from '@/components/manager-profile/ProfileEditTab';
import CompanyLeadsTab from '@/components/manager-profile/CompanyLeadsTab';
import { PageLoader } from '@/components/common/LoadingSkeleton';

const ManageProfile: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useEnhancedAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [permissions, setPermissions] = useState({
    can_edit_profile: false,
    can_edit_funds: false,
    can_manage_team: false,
  });

  const activeTab = searchParams.get('tab') || 'profile';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

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
        };

        // First check if user is an admin
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_user_admin', {
          check_user_id: user.id,
        });

        if (!adminError && isAdmin) {
          // Admins get full permissions without checking manager_profile_assignments
          access = true;
          userPermissions = {
            can_edit_profile: true,
            can_edit_funds: true,
            can_manage_team: true,
          };
          console.log('[ManageProfile] User is admin, granted full permissions');
        } else {
          // Non-admins: check assignment permissions
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

          // Get detailed permissions from assignment
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
              console.log('[ManageProfile] User permissions from assignment', userPermissions);
            }
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
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <FundManagerSidebar />
          <div className="flex-1 p-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to manage this company profile.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!profile) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <FundManagerSidebar />
          <div className="flex-1 p-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Company profile not found.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <FundManagerSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-xl font-semibold">{profile.company_name}</h1>
            </div>
          </header>
          
          {/* Breadcrumb Navigation */}
          <div className="border-b bg-muted/30 px-4 lg:px-6 py-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/my-funds">My Companies</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/my-funds">{profile.company_name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{activeTab === 'leads' ? 'Leads' : 'Edit Profile'}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="leads" className="gap-2">
                    <Users className="h-4 w-4" />
                    Leads
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
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

                <TabsContent value="leads">
                  <CompanyLeadsTab 
                    profileId={profileId!} 
                    companyName={profile.company_name!} 
                  />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ManageProfile;