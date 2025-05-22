
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFundById } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Import our components
import BackToFundsButton from '../components/fund-details/BackToFundsButton';
import FundDetailsContent from '../components/fund-details/FundDetailsContent';
import FundDetailsSEO from '../components/fund-details/FundDetailsSEO';

const FundDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fund = id ? getFundById(id) : undefined;

  // If fund not found, redirect to homepage
  if (!fund) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* SEO Component */}
      <FundDetailsSEO fund={fund} />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <BackToFundsButton />
          <FundDetailsContent fund={fund} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundDetails;
