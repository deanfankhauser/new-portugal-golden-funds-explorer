
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PageSEO } from '../components/common/PageSEO';
import FundDetailsContent from '../components/fund-details/FundDetailsContent';
import FloatingCTA from '../components/fund-details/FloatingCTA';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import type { Fund } from '../data/types/funds';

interface FundDetailsProps { fund?: Fund }

const FundDetails: React.FC<FundDetailsProps> = ({ fund: ssrFund }) => {
  const { id, potentialFundId } = useParams<{ id?: string; potentialFundId?: string }>();
  const location = useLocation();
  
  // Prefer SSR-injected fund when available; fallback to client lookup
  const fundId = id || potentialFundId || ssrFund?.id;
  const { getFundById } = useRealTimeFunds();
  const fund = ssrFund ?? (fundId ? getFundById(fundId) : null);
  const { addToRecentlyViewed } = useRecentlyViewed();
  useEffect(() => {
    if (fund) {
      addToRecentlyViewed(fund);
    }
  }, [fund, addToRecentlyViewed]);

  if (!fund) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PageSEO pageType="404" />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Fund Not Found</h1>
            <p className="text-muted-foreground">The fund you're looking for doesn't exist.</p>
            <p className="text-sm text-muted-foreground mt-2">ID searched: {fundId}</p>
            <p className="text-sm text-muted-foreground">URL: {location.pathname}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO pageType="fund" fundName={fund.name} funds={[fund]} />
      
      <Header />
      
      <main className="flex-1 py-6 md:py-8 pb-32 lg:pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <FundDetailsContent fund={fund} />
        </div>
      </main>
      
      <FloatingCTA fund={fund} />
      
      <Footer />
    </div>
  );
};

export default FundDetails;
