import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FAQsContent from '../components/faqs/FAQsContent';

const FAQs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="faqs" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <FAQsContent />
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQs;
