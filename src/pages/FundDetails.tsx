
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
  
  // Enhanced fund lookup to handle proxy routing
  let fund = null;
  let finalId = id;
  
  // If we're on a proxy route like /horizon-fund, look up the fund directly
  if (id && !id.startsWith('funds/')) {
    fund = getFundById(id);
    console.log('🚨 FundDetails: Direct fund lookup for proxy route:', { id, found: !!fund });
  }
  
  // If not found and we have a complex path, try extracting the fund ID
  if (!fund && location.pathname.includes('/funds/')) {
    const pathParts = location.pathname.split('/');
    const fundIdFromPath = pathParts[pathParts.length - 1];
    fund = getFundById(fundIdFromPath);
    finalId = fundIdFromPath;
    console.log('🚨 FundDetails: Path-based fund lookup:', { fundIdFromPath, found: !!fund });
  }
  
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    // CRITICAL DEBUGGING for proxy route matching
    console.log('🚨 FundDetails: ROUTE DEBUGGING START 🚨');
    console.log('🚨 FundDetails: URL params from useParams:', { id });
    console.log('🚨 FundDetails: Current location:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      fullUrl: window.location.href
    });
    console.log('🚨 FundDetails: Fund lookup result:', {
      originalId: id,
      finalId,
      foundFund: !!fund,
      fundName: fund?.name,
      fundId: fund?.id
    });
    
    // Check if URL matches expected patterns
    const patterns = [
      /^\/funds\/([^\/]+)$/, // Standard pattern
      /^\/([^\/]+)$/ // Proxy pattern
    ];
    
    patterns.forEach((pattern, index) => {
      const match = location.pathname.match(pattern);
      console.log(`🚨 FundDetails: Pattern ${index + 1} analysis:`, {
        pattern: pattern.toString(),
        matches: !!match,
        extractedId: match ? match[1] : null
      });
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
  }, [fund, addToRecentlyViewed, location, id, finalId]);

  if (!fund) {
    console.error('🚨 FundDetails: Rendering 404 - Fund not found for ID:', finalId);
    console.error('🚨 FundDetails: This is why you see default homepage SEO!');
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PageSEO pageType="404" />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Fund Not Found</h1>
            <p className="text-gray-600">The fund you're looking for doesn't exist.</p>
            <p className="text-sm text-gray-500 mt-2">ID searched: {finalId}</p>
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
