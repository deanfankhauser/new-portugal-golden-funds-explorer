
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundManagerContent from '../components/fund-manager/FundManagerContent';

const FundManager = () => {
  const { name } = useParams<{ name: string }>();
  const managerName = name?.replace(/-/g, ' ') || '';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [name]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="manager" managerName={managerName} />
      
      <Header />
      
      <FundManagerContent managerName={managerName} />
      
      <Footer />
    </div>
  );
};

export default FundManager;
