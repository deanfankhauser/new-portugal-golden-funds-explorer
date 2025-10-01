
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PageSEO } from '../components/common/PageSEO';
import FundDetailsContent from '../components/fund-details/FundDetailsContent';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import { useFundPageSEOAudit } from '../hooks/useFundPageSEOAudit';
import type { Fund } from '../data/types/funds';

const FundDetails = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  
  // Extract fund ID from route params or pathname
  // Support both /funds/:id and /:id patterns
  const fundId = id || location.pathname.slice(1).split('/')[0];
  
  const { getFundById, loading } = useRealTimeFunds();
  const fund = fundId ? getFundById(fundId) : null;
  const { addToRecentlyViewed } = useRecentlyViewed();
  
  // Run SEO audit in development when fund is loaded
  const { auditResult } = useFundPageSEOAudit(import.meta.env.DEV && !!fund);
  
  useEffect(() => {
    if (fund) {
      addToRecentlyViewed(fund);
    }
  }, [fund, addToRecentlyViewed]);

  // Show loading state while fetching funds
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading fund details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
      
      <main className="flex-1 py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <FundDetailsContent fund={fund} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundDetails;
