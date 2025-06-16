
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import ManagersList from '../components/managers-hub/ManagersList';
import ManagersHubHeader from '../components/managers-hub/ManagersHubHeader';
import ManagersHubBreadcrumbs from '../components/managers-hub/ManagersHubBreadcrumbs';
import { getAllFundManagers } from '../data/services/managers-service';

const ManagersHub = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const managers = getAllFundManagers();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="managers-hub" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <ManagersHubBreadcrumbs />
        <ManagersHubHeader />
        <ManagersList managers={managers} />
      </main>
      
      <Footer />
    </div>
  );
};

export default ManagersHub;
