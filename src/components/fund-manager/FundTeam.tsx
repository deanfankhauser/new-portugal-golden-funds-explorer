import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { useFund } from '@/hooks/useFundsQuery';
import { PageLoader } from '@/components/common/LoadingSkeleton';
import PageSEO from '@/components/common/PageSEO';
import TeamAccessTab from './TeamAccessTab';

const FundTeam: React.FC = () => {
  const { fundId } = useParams<{ fundId: string }>();
  const { user, loading: authLoading } = useEnhancedAuth();
  const { data: fund, isLoading: fundLoading } = useFund(fundId);

  if (authLoading || fundLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!fund) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <PageSEO pageType="about" />
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{fund.name}</h1>
          <p className="text-muted-foreground mt-1">
            Team access and permissions
          </p>
        </div>

        <TeamAccessTab fund={fund} />
      </div>
    </>
  );
};

export default FundTeam;
