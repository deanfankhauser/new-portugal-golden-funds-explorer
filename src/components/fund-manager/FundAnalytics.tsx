import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { useFund } from '@/hooks/useFundsQuery';
import { PageLoader } from '@/components/common/LoadingSkeleton';
import PageSEO from '@/components/common/PageSEO';
import AnalyticsTab from './AnalyticsTab';
import { isDevelopment } from '@/lib/environment';

const FundAnalytics: React.FC = () => {
  const { fundId } = useParams<{ fundId: string }>();
  const { user, loading: authLoading } = useEnhancedAuth();
  const { data: fund, isLoading: fundLoading } = useFund(fundId);

  if (authLoading || fundLoading) {
    return <PageLoader />;
  }

  // DEV MODE BYPASS - skip auth check in preview/localhost
  if (!user && !isDevelopment()) {
    return <Navigate to="/auth" replace />;
  }

  if (!fund || !fundId) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <PageSEO pageType="about" />
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{fund.name}</h1>
          <p className="text-muted-foreground mt-1">
            Fund analytics and engagement metrics
          </p>
        </div>

        <AnalyticsTab fundId={fundId} />
      </div>
    </>
  );
};

export default FundAnalytics;
