
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';

const FAQs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="faqs" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about Golden Visa investment funds.</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQs;
