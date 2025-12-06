import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PageLoader } from '@/components/common/LoadingSkeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Profile } from '@/types/profile';
import PageSEO from '@/components/common/PageSEO';
import ProfileEditTab from '@/components/manager-profile/ProfileEditTab';
import { isDevelopment } from '@/lib/environment';

const CompanyDetails: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { user, loading: authLoading } = useEnhancedAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(isDevelopment()); // Auto-grant in dev mode
  const [isAdmin, setIsAdmin] = useState(isDevelopment()); // Auto-grant in dev mode
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track when profileId changes to show transition state
  useEffect(() => {
    setIsTransitioning(true);
    setLoading(true);
  }, [profileId]);

  useEffect(() => {
    const checkAccessAndFetchProfile = async () => {
      if (!profileId) {
        setLoading(false);
        return;
      }

      // Skip permission check in dev mode, just fetch profile
      if (isDevelopment()) {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profileId)
            .single();

          if (error) throw error;
          setProfile(profileData as unknown as Profile);
          setHasAccess(true);
          setIsAdmin(true);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
          setIsTransitioning(false);
        }
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check admin status
        const { data: adminData } = await supabase.rpc('is_user_admin');
        const userIsAdmin = !!adminData;
        setIsAdmin(userIsAdmin);

        // Check access
        if (userIsAdmin) {
          setHasAccess(true);
        } else {
          const { data: accessData } = await supabase.rpc('can_user_edit_profile', {
            p_user_id: user.id,
            p_profile_id: profileId
          });
          setHasAccess(!!accessData);
        }

        // Fetch profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();

        if (error) throw error;

        setProfile(profileData as unknown as Profile);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
        setIsTransitioning(false);
      }
    };

    checkAccessAndFetchProfile();
  }, [user, profileId]);

  if (authLoading || loading) {
    return <PageLoader />;
  }

  // DEV MODE BYPASS - skip auth check in preview/localhost
  if (!user && !isDevelopment()) {
    return <Navigate to="/auth" replace />;
  }

  if (!hasAccess) {
    return (
      <>
        <PageSEO pageType="about" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have access to manage this company profile. If you believe this is an error, please contact support.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <PageSEO pageType="about" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Company profile not found.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  return (
    <>
      <PageSEO pageType="about" />
      
      <div className="max-w-6xl mx-auto relative">
        {isTransitioning && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm font-medium text-muted-foreground">Loading company data...</p>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{profile.company_name}</h1>
          <p className="text-muted-foreground mt-1">
            Edit company profile information
          </p>
        </div>

        <ProfileEditTab 
          key={profileId}
          profile={profile}
        />
      </div>
    </>
  );
};

export default CompanyDetails;
