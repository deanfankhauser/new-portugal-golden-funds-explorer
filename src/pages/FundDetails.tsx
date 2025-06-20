
import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getFundById } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundDetailsContent from '../components/fund-details/FundDetailsContent';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';

const FundDetails = () => {
  const { id, potentialFundId } = useParams<{ id?: string; potentialFundId?: string }>();
  const location = useLocation();
  
  // Support both route patterns: /funds/:id and /:potentialFundId
  const fundId = id || potentialFundId;
  const fund = fundId ? getFundById(fundId) : null;
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    // Enhanced debugging for both route patterns
    console.log('🚨 FundDetails: ROUTE DEBUGGING START 🚨');
    console.log('🚨 FundDetails: URL params from useParams:', { id, potentialFundId, finalFundId: fundId });
    console.log('🚨 FundDetails: Current location:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      fullUrl: window.location.href
    });
    console.log('🚨 FundDetails: Fund lookup result:', {
      foundFund: !!fund,
      fundName: fund?.name,
      fundId: fund?.id
    });
    
    // Check route pattern
    const isDirectRoute = location.pathname.split('/').length === 2 && !location.pathname.startsWith('/funds/');
    const isFundsRoute = location.pathname.startsWith('/funds/');
    
    console.log('🚨 FundDetails: Route pattern analysis:', {
      pathname: location.pathname,
      isDirectRoute,
      isFundsRoute,
      extractedId: fundId,
      routeType: isDirectRoute ? 'direct' : 'funds'
    });

    if (fund) {
      addToRecentlyViewed(fund);
      console.log('🚨 FundDetails: ✅ Fund found, will render fund-specific content');
    } else {
      console.error('🚨 FundDetails: ❌ No fund found! This explains the default SEO');
      console.error('🚨 FundDetails: Available fund IDs in system:', 
        // Get all available fund IDs for debugging
        Object.keys(require('../data/funds').getAllFunds().reduce((acc, f) => ({...acc, [f.id]: f.name}), {}))
      );
    }

    window.scrollTo(0, 0);
  }, [fund, addToRecentlyViewed, location, id, potentialFundId, fundId]);

  if (!fund) {
    console.error('🚨 FundDetails: Rendering 404 - Fund not found for ID:', fundId);
    console.error('🚨 FundDetails: This is why you see default homepage SEO!');
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

  console.log('🚨 FundDetails: ✅ Rendering fund page with correct SEO for:', fund.name);

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
