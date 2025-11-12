
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import ManagersList from '../components/managers-hub/ManagersList';
import ManagersHubHeader from '../components/managers-hub/ManagersHubHeader';
import ManagersHubBreadcrumbs from '../components/managers-hub/ManagersHubBreadcrumbs';
import { getAllFundManagers } from '../data/services/managers-service';
import { useAllFunds } from '../hooks/useFundsQuery';
import FundListSkeleton from '../components/common/FundListSkeleton';

const ManagersHub = () => {
  const { data: allFundsData, isLoading } = useAllFunds();
  const allDatabaseFunds = allFundsData || [];
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const managers = getAllFundManagers(allDatabaseFunds);

  if (isLoading) {
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
      </main>
      
      <Footer />
    </div>
  );
};

export default ManagersHub;
