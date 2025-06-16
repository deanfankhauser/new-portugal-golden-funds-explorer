
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFundsByManager } from '../data/services/managers-service';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundManagerContent from '../components/fund-manager/FundManagerContent';
import FundManagerNotFound from '../components/fund-manager/FundManagerNotFound';

const FundManager = () => {
  const { name } = useParams<{ name: string }>();
  const managerName = name?.replace(/-/g, ' ') || '';
  const managerFunds = getFundsByManager(managerName);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [name]);

  if (managerFunds.length === 0) {
    return <FundManagerNotFound managerName={managerName} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="manager" managerName={managerName} />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <FundManagerContent managerFunds={managerFunds} managerName={managerName} />
      </main>
      
      <Footer />
    </div>
  );
};

export default FundManager;
