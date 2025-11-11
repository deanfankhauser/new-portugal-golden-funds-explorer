import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFundsByManager, getAllFundManagers, getAllApprovedManagers } from '../data/services/managers-service';
import { slugToManager, managerToSlug } from '../lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundManagerContent from '../components/fund-manager/FundManagerContent';
import FundManagerNotFound from '../components/fund-manager/FundManagerNotFound';
import FundManagerBreadcrumbs from '../components/fund-manager/FundManagerBreadcrumbs';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';

const FundManager = () => {
  const { name } = useParams<{ name: string }>();
  const slugName = name || '';
  const managerName = slugToManager(slugName);
  const allManagers = getAllFundManagers();
  const [isManagerVerified, setIsManagerVerified] = useState(false);
  const [managerProfile, setManagerProfile] = useState<Profile | null>(null);
  
  // Find matching manager by checking if any manager matches when converted to slug
  const matchingManager = allManagers.find(manager => 
    managerToSlug(manager.name) === slugName
  );
  
  const displayManagerName = matchingManager ? matchingManager.name : managerName;
  const managerFunds = matchingManager ? getFundsByManager(matchingManager.name) : [];

  useEffect(() => {
    const checkManagerVerification = async () => {
      const approvedManagers = await getAllApprovedManagers();
      
      // Normalize manager name by removing common suffixes and punctuation
      const normalizeCompanyName = (name: string) => {
        return name
          .toLowerCase()
          .replace(/[,\.]/g, '') // Remove commas and periods
          .replace(/\b(s\.?a\.?|llc|ltd|limited|inc|incorporated|scr|sgps)\b/gi, '') // Remove company suffixes
          .trim();
      };
      
      const normalizedManagerName = normalizeCompanyName(displayManagerName);
      
      const matchingProfile = approvedManagers.find(m => {
        const normalizedCompanyName = normalizeCompanyName(m.company_name);
        const normalizedDbManagerName = m.manager_name ? normalizeCompanyName(m.manager_name) : '';
        
        // Check if either company name or manager name matches
        return normalizedCompanyName === normalizedManagerName || 
               normalizedDbManagerName === normalizedManagerName ||
               normalizedCompanyName.includes(normalizedManagerName) ||
               normalizedManagerName.includes(normalizedCompanyName);
      });
      
      if (matchingProfile) {
        setIsManagerVerified(true);
        
        // Fetch full profile data
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', matchingProfile.id)
          .single();
        
        if (data) {
          setManagerProfile(data);
        }
      }
    };
    
    if (displayManagerName) {
      checkManagerVerification();
    }
  }, [displayManagerName, slugName]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [name]);

  if (!matchingManager || managerFunds.length === 0) {
    return <FundManagerNotFound managerName={displayManagerName} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="manager" managerName={displayManagerName} />
      
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1">
        <FundManagerBreadcrumbs managerName={displayManagerName} />
        
        <FundManagerContent 
          managerFunds={managerFunds} 
          managerName={displayManagerName} 
          isManagerVerified={isManagerVerified}
          managerProfile={managerProfile}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default FundManager;
