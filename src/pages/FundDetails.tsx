
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
    window.scrollTo(0, 0);

    // Enhanced debugging for proxy detection
    console.log('FundDetails: Route and fund information:', {
      id,
      fundExists: !!fund,
      fundName: fund?.name,
      pathname: location.pathname,
      search: location.search,
      currentUrl: window.location.href,
      origin: window.location.origin
    });

    // Check if we're under a proxy
    const isUnderProxy = window.location.pathname.startsWith('/funds/') || 
                        window.location.href.includes('/funds/');
    
    console.log('FundDetails: Proxy detection:', {
      isUnderProxy,
      pathname: window.location.pathname,
      shouldPassFundName: !!fund?.name
    });

    if (fund) {
      console.log('FundDetails: Will pass fund name to PageSEO:', fund.name);
    } else {
      console.warn('FundDetails: No fund found, PageSEO will receive undefined fund name');
    }
  }, [fund, addToRecentlyViewed, location, id]);

  if (!fund) {
    console.error('FundDetails: Fund not found for ID:', id);
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

  console.log('FundDetails: Rendering with fund:', {
    id: fund.id,
    name: fund.name,
    willPassToPageSEO: true
  });

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
