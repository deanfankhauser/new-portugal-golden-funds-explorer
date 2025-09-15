
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundDetailsContent from '../components/fund-details/FundDetailsContent';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import type { Fund } from '../data/types/funds';

const FundDetails = () => {
  const { id, potentialFundId } = useParams<{ id?: string; potentialFundId?: string }>();
  const location = useLocation();
  
  // Support direct fund routing: /:fundId
  const fundId = id || potentialFundId;
  const { getFundById } = useRealTimeFunds();
  const fund = fundId ? getFundById(fundId) : null;
  const { addToRecentlyViewed } = useRecentlyViewed();
  useEffect(() => {
    if (fund) {
      addToRecentlyViewed(fund);
    }
    window.scrollTo(0, 0);
  }, [fund, addToRecentlyViewed]);

  if (!fund) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PageSEO pageType="404" />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Fund Not Found</h1>
            <p className="text-gray-600">The fund you're looking for doesn't exist.</p>
            <p className="text-sm text-gray-500 mt-2">ID searched: {fundId}</p>
            <p className="text-sm text-gray-500">URL: {location.pathname}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render fund page

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="fund" fundName={fund.name} />
      
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
