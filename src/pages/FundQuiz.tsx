import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';

const FundQuiz = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="fund-quiz" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Content specific to the Fund Quiz page */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect Golden Visa Fund
          </h1>
          <p className="text-gray-600 mb-8">
            Answer a few questions to get personalized fund recommendations.
          </p>
          {/* Add your quiz component here */}
          <div>
            Quiz Content Goes Here
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundQuiz;
