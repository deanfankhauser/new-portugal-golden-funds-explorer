import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllApprovedManagers } from '../data/services/managers-service';
import { slugToManager, managerToSlug } from '../lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundManagerContent from '../components/fund-manager/FundManagerContent';
import FundManagerNotFound from '../components/fund-manager/FundManagerNotFound';
import FundManagerBreadcrumbs from '../components/fund-manager/FundManagerBreadcrumbs';
import { Profile } from '@/types/profile';
import { useAllFunds } from '../hooks/useFundsQuery';
import { Fund } from '../data/types/funds';
import { FloatingActionButton } from '../components/common/FloatingActionButton';

const isSSG = typeof window === 'undefined';

const FundManager = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const slugName = name || '';
  const managerName = slugToManager(slugName);
  const [isManagerVerified, setIsManagerVerified] = useState(false);
  const [managerProfile, setManagerProfile] = useState<Profile | null>(null);
  const [displayManagerName, setDisplayManagerName] = useState(managerName);
  const [managerFunds, setManagerFunds] = useState<Fund[]>([]);
  
  // Fetch all funds from database
  const { data: allFunds, isLoading } = useAllFunds();

  // Find matching manager and their funds from database
  useEffect(() => {
    if (!allFunds || allFunds.length === 0) return;
    
    // Get all unique managers from database funds
    const managersMap = new Map<string, string>();
    allFunds.forEach(fund => {
      const normalizedKey = fund.managerName.toLowerCase();
      if (!managersMap.has(normalizedKey)) {
        managersMap.set(normalizedKey, fund.managerName);
      }
    });
    
    // Find manager whose slug matches the URL
    const matchingManager = Array.from(managersMap.values()).find(manager => 
      managerToSlug(manager) === slugName
    );
    
    if (matchingManager) {
      setDisplayManagerName(matchingManager);
      
      // Get all funds for this manager
      const funds = allFunds.filter(fund =>
        fund.managerName.toLowerCase() === matchingManager.toLowerCase()
      );
      setManagerFunds(funds);
    }
  }, [allFunds, slugName]);

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
        // Use the complete profile from getAllApprovedManagers - no need for second fetch
        setManagerProfile(matchingProfile as unknown as Profile);
      }
    };
    
    if (displayManagerName) {
      checkManagerVerification();
    }
  }, [displayManagerName]);

  // Canonicalize manager slug
  useEffect(() => {
    if (!name || isSSG) return;
    const expected = managerToSlug(slugToManager(name));
    if (name !== expected) {
      navigate(`/manager/${expected}`, { replace: true });
    }
  }, [name, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [name]);

  // Return minimal shell during SSG
  if (isSSG) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PageSEO pageType="manager" managerName={displayManagerName} />
        <Header />
        <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading fund manager...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading fund manager...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (managerFunds.length === 0) {
    return <FundManagerNotFound managerName={displayManagerName} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO 
        pageType="manager" 
        managerName={displayManagerName}
        managerProfile={managerProfile}
        funds={managerFunds}
      />
      
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
      
      <FloatingActionButton />
    </div>
  );
};

export default FundManager;
