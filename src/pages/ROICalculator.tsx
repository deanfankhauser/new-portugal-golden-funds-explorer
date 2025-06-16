import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';

const ROICalculator = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="roi-calculator" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4">ROI Calculator</h1>
          <p>This is a placeholder for the ROI Calculator content.</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ROICalculator;
