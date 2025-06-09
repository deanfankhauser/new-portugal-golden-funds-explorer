
import React, { useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import PageSEO from '../components/common/PageSEO';
import { getAllFundManagers } from '../data/services/managers-service';
import ManagersHubBreadcrumbs from '../components/managers-hub/ManagersHubBreadcrumbs';
import ManagersHubHeader from '../components/managers-hub/ManagersHubHeader';
import ManagersList from '../components/managers-hub/ManagersList';

const ManagersHub = () => {
  const managers = getAllFundManagers();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="managers-hub" />

      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1" itemScope itemType="https://schema.org/CollectionPage">
        <ManagersHubBreadcrumbs />
        <ManagersHubHeader />
        <ManagersList managers={managers} />
      </main>
      
      <Footer />
    </div>
  );
};

export default ManagersHub;
