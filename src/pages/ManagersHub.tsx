import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundManagerList from '../components/fund-manager/FundManagerList';

const ManagersHub = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="managers-hub" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Portugal Golden Visa Fund Managers
          </h1>
          <p className="text-lg text-gray-600">
            Explore the fund managers offering Golden Visa investment opportunities.
          </p>
        </div>
        
        <FundManagerList />
      </main>
      
      <Footer />
    </div>
  );
};

export default ManagersHub;
