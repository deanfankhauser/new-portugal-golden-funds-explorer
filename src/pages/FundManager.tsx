
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getFundsByManager, getAllFundManagers, getAllApprovedManagers } from '../data/services/managers-service';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundManagerContent from '../components/fund-manager/FundManagerContent';
import FundManagerNotFound from '../components/fund-manager/FundManagerNotFound';
import FundManagerBreadcrumbs from '../components/fund-manager/FundManagerBreadcrumbs';
import VerificationFilterChip from '../components/common/VerificationFilterChip';
import { slugToManager, managerToSlug } from '../lib/utils';

const FundManager = () => {
  const { name } = useParams<{ name: string }>();
  const slugName = name || '';
  const managerName = slugToManager(slugName);
  const allManagers = getAllFundManagers();
  const [isManagerVerified, setIsManagerVerified] = useState(false);
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  
  // Find matching manager by checking if any manager matches when converted to slug
  const matchingManager = allManagers.find(manager => 
    managerToSlug(manager.name) === slugName
  );
  
  const displayManagerName = matchingManager ? matchingManager.name : managerName;
  const allManagerFunds = matchingManager ? getFundsByManager(matchingManager.name) : [];
  
  // Filter funds by verification status
  const managerFunds = useMemo(() => {
    if (!showOnlyVerified) return allManagerFunds;
    return allManagerFunds.filter(fund => fund.isVerified);
  }, [allManagerFunds, showOnlyVerified]);

  useEffect(() => {
    const checkManagerVerification = async () => {
      const approvedManagers = await getAllApprovedManagers();
      const slugMatches = (s?: string) => (s ? managerToSlug(s) === slugName : false);
      const verifiedManager = approvedManagers.find(
        (m) =>
          m.manager_name?.toLowerCase() === displayManagerName.toLowerCase() ||
          slugMatches(m.manager_name) ||
          slugMatches(m.company_name)
      );
      setIsManagerVerified(!!verifiedManager && verifiedManager.status === 'approved');
    };
    
    if (displayManagerName) {
      checkManagerVerification();
    }
  }, [displayManagerName, slugName]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [name]);

  if (!matchingManager || allManagerFunds.length === 0) {
    return <FundManagerNotFound managerName={displayManagerName} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="manager" managerName={displayManagerName} />
      
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1">
        <FundManagerBreadcrumbs managerName={displayManagerName} />
        
        {/* Verification Filter */}
        <div className="mb-6">
          <VerificationFilterChip 
            showOnlyVerified={showOnlyVerified}
            setShowOnlyVerified={setShowOnlyVerified}
          />
        </div>
        
        {managerFunds.length === 0 && showOnlyVerified ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No verified funds found for {displayManagerName}.
            </p>
            <p className="text-muted-foreground mt-2">
              Try disabling the verification filter to see all {allManagerFunds.length} funds.
            </p>
          </div>
        ) : (
          <FundManagerContent 
            managerFunds={managerFunds} 
            managerName={displayManagerName} 
            isManagerVerified={isManagerVerified}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default FundManager;
