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

const CompanyDetails: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { user, loading: authLoading } = useEnhancedAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAccessAndFetchProfile = async () => {
      if (!user || !profileId) {
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
      }
    };

    checkAccessAndFetchProfile();
  }, [user, profileId]);

  if (authLoading || loading) {
    return <PageLoader />;
  }

  if (!user) {
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
      
      <div className="max-w-6xl mx-auto">
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
