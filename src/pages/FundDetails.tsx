
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFundById } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundDetailsContent from '../components/fund-details/FundDetailsContent';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';

const FundDetails = () => {
  const { id } = useParams<{ id: string }>();
  const fund = id ? getFundById(id) : null;
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
