
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getFundById } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundDetailsContent from '../components/fund-details/FundDetailsContent';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { supabase } from '@/integrations/supabase/client';
import type { Fund } from '../data/types/funds';

const FundDetails = () => {
  const { id, potentialFundId } = useParams<{ id?: string; potentialFundId?: string }>();
  const location = useLocation();
  
  // Support direct fund routing: /:fundId
  const fundId = id || potentialFundId;
  const fund = fundId ? getFundById(fundId) : null;
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [displayedFund, setDisplayedFund] = useState<Fund | null>(fund);

  // Merge any approved edits from Supabase (publicly viewable edit history)
  useEffect(() => {
    let isMounted = true;
    const fetchOverrides = async () => {
      if (!fund || !fundId) {
        if (isMounted) setDisplayedFund(fund || null);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('fund_edit_history')
          .select('changes, applied_at, id')
          .eq('fund_id', fundId)
          .order('applied_at', { ascending: true });
        if (error) {
          console.error('Error fetching fund edit history:', error);
          if (isMounted) setDisplayedFund(fund);
          return;
        }
        if (data && data.length > 0) {
          const overlay = (data as any[]).reduce((acc, row) => ({ ...acc, ...(row.changes || {}) }), {} as Partial<Fund>);
          if (isMounted) setDisplayedFund({ ...(fund as Fund), ...(overlay as any) });
        } else {
          if (isMounted) setDisplayedFund(fund);
        }
      } catch (e) {
        console.error('Exception fetching fund edit history:', e);
        if (isMounted) setDisplayedFund(fund);
      }
    };
    fetchOverrides();
    return () => { isMounted = false; };
  }, [fundId, fund]);

  useEffect(() => {
    if (displayedFund) {
      addToRecentlyViewed(displayedFund);
    }
    window.scrollTo(0, 0);
  }, [displayedFund, addToRecentlyViewed]);

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
      <PageSEO pageType="fund" fundName={(displayedFund || fund).name} />
      
      <Header />
      
      <main className="flex-1 py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <FundDetailsContent fund={(displayedFund || fund) as Fund} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundDetails;
