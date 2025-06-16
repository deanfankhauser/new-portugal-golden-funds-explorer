
import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getFundById } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundDetailsContent from '../components/fund-details/FundDetailsContent';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';

const FundDetails = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const fund = id ? getFundById(id) : null;
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    if (fund) {
      addToRecentlyViewed(fund);
    }
  }, [fund, addToRecentlyViewed]);

  // Separate useEffect for scrolling to ensure it happens after render
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [location.pathname]); // Trigger on route change

  if (!fund) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Fund Not Found</h1>
            <p className="text-gray-600">The fund you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="fund" fundName={fund.name} />
      
      <Header />
      
      <FundDetailsContent fund={fund} />
      
      <Footer />
    </div>
  );
};

export default FundDetails;
