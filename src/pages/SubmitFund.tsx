import React from 'react';
import { Navigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { PageLoader } from '@/components/common/LoadingSkeleton';
import SubmitFundForm from '@/components/submit-fund/SubmitFundForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';

export default function SubmitFund() {
  const { user, loading } = useEnhancedAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/auth?redirect=/submit-fund" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Submit Your Fund | Movingto Funds</title>
        <meta name="description" content="List your investment fund on the Movingto Funds platform. Reach qualified investors and grow your fund." />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <SubmitFundForm />
        </main>
        <Footer />
      </div>
    </>
  );
}
