import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { PageLoader } from '@/components/common/LoadingSkeleton';
import PageSEO from '@/components/common/PageSEO';
import TeamAccessTab from './TeamAccessTab';
import { supabase } from '@/integrations/supabase/client';
import { isDevelopment } from '@/lib/environment';

const FundTeam: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { user, loading: authLoading } = useEnhancedAuth();
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!profileId) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('company_name')
        .eq('id', profileId)
        .single();
      
      setCompanyName(data?.company_name || null);
      setLoading(false);
    };

    fetchCompany();
  }, [profileId]);

  if (authLoading || loading) {
    return <PageLoader />;
  }

  // DEV MODE BYPASS - skip auth check in preview/localhost
  if (!user && !isDevelopment()) {
    return <Navigate to="/auth" replace />;
  }

  if (!companyName) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <PageSEO pageType="about" />
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{companyName}</h1>
          <p className="text-muted-foreground mt-1">
            Team access and permissions
          </p>
        </div>

        <TeamAccessTab companyName={companyName} />
      </div>
    </>
  );
};

export default FundTeam;
