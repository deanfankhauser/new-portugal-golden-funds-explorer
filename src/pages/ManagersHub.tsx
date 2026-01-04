
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import ManagersList from '../components/managers-hub/ManagersList';
import ManagersHubHeader from '../components/managers-hub/ManagersHubHeader';
import ManagersHubBreadcrumbs from '../components/managers-hub/ManagersHubBreadcrumbs';
import { getAllFundManagers } from '../data/services/managers-service';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import FundListSkeleton from '../components/common/FundListSkeleton';
import { Fund } from '../data/types/funds';

interface ManagersHubProps {
  initialFunds?: Fund[];
}

const ManagersHub: React.FC<ManagersHubProps> = ({ initialFunds }) => {
  const { funds: allFundsData, loading: isLoading } = useRealTimeFunds({
    initialData: initialFunds
  });
  const allDatabaseFunds = allFundsData || [];
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const managers = getAllFundManagers(allDatabaseFunds);

  // Only show loading when no initial data was provided
  if (isLoading && !initialFunds) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-1">
          <FundListSkeleton count={6} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="managers-hub" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <ManagersHubBreadcrumbs />
        <ManagersHubHeader />
        <ManagersList managers={managers} funds={allDatabaseFunds} />
        
        {/* Link to Main Hub */}
        <div className="mt-8 text-center">
          <a 
            href="https://www.movingto.com/portugal-golden-visa-funds" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
          >
            Browse All Portugal Golden Visa Funds
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ManagersHub;
