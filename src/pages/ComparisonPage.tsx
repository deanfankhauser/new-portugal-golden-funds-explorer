import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';

const ComparisonPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="comparison" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Compare Funds</h1>
          <p className="text-gray-600">Select funds to compare.</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComparisonPage;
