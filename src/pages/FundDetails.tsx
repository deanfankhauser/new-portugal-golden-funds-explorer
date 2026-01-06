
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PageSEO } from '../components/common/PageSEO';
import FundDetailsContent from '../components/fund-details/FundDetailsContent';
import FloatingCTA from '../components/fund-details/FloatingCTA';
import StickyHelpBar from '../components/common/StickyHelpBar';
import { FundDetailsLoader } from '../components/common/LoadingSkeleton';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { useFund } from '../hooks/useFundsQuery';
import { trackPageView } from '../utils/analyticsTracking';
import type { Fund } from '../data/types/funds';

interface TeamMemberSSR {
  id: string;
  slug: string;
  name: string;
  role: string;
  profile_id: string;
  linkedin_url?: string;
  photo_url?: string;
  bio?: string;
  company_name?: string;
}

interface FundDetailsProps { 
  fund?: Fund;
  initialId?: string; // For SSR
  initialFunds?: Fund[]; // For SSR internal linking
  initialTeamMembers?: TeamMemberSSR[]; // For SSR team member links
}

const FundDetails: React.FC<FundDetailsProps> = ({ fund: ssrFund, initialId, initialFunds, initialTeamMembers }) => {
  const isSSR = typeof window === 'undefined';
  const { id, potentialFundId } = useParams<{ id?: string; potentialFundId?: string }>();
  const location = useLocation();
  
  // During SSR, prefer initialId; in browser, use route params
  const fundId = isSSR ? initialId : (id || potentialFundId || ssrFund?.id);
  
  if (isSSR && initialId) {
    console.log('🔥 SSR FundDetails: initialId=%s, ssrFund=%s', initialId, ssrFund ? ssrFund.name : 'not provided');
  }
  
  // Use optimized React Query hook for single fund fetching
  const { data: queriedFund, isLoading, isFetching } = useFund(fundId);
  
  const fund = ssrFund ?? queriedFund;
  const { addToRecentlyViewed } = useRecentlyViewed();
  
  // Track initial mount to prevent premature 404 display
  const [isInitialMount, setIsInitialMount] = useState(true);
  
  useEffect(() => {
    if (fundId) {
      setIsInitialMount(false);
    }
  }, [fundId]);
  
  useEffect(() => {
    if (fund?.id) {
      addToRecentlyViewed(fund);
      
      // Only track if we haven't tracked this fund recently (1 minute cooldown)
      const trackingKey = `tracked_${fund.id}`;
      const lastTracked = sessionStorage.getItem(trackingKey);
      const now = Date.now();
      
      if (!lastTracked || now - parseInt(lastTracked) > 60000) {
        trackPageView(fund.id);
        sessionStorage.setItem(trackingKey, now.toString());
      }
    }
  }, [fund?.id]); // Only depend on stable ID

  // Handle hash-based scrolling to enquiry form
  useEffect(() => {
    if (!isSSR && location.hash === '#enquiry-form' && fund) {
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        const enquirySection = document.getElementById('enquiry-form');
        if (enquirySection) {
          enquirySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Focus the first input in the form after scroll
          setTimeout(() => {
            const firstInput = enquirySection.querySelector('input, textarea');
            if (firstInput instanceof HTMLElement) {
              firstInput.focus();
            }
          }, 500);
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isSSR, location.hash, fund]);

  // Show loading skeleton only in browser when actually loading
  // During SSR, skip loading state if we have ssrFund data
  if (!isSSR && (!fundId || isLoading || isFetching || (isInitialMount && !fund))) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PageSEO pageType="fund" />
        <Header />
        <main className="flex-1 py-6 md:py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <FundDetailsLoader />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Only show 404 when we're absolutely certain the fund doesn't exist
  if (fundId && !fund && !isLoading && !isFetching) {
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
          <FundDetailsContent fund={fund} initialFunds={initialFunds} initialTeamMembers={initialTeamMembers} />
        </div>
      </main>
      
      <FloatingCTA fund={fund} />
      <StickyHelpBar fundName={fund.name} />
      
      <Footer />
    </div>
  );
};

export default FundDetails;
