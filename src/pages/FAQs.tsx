
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
        {/* Link Section */}
        <div className="mb-8 text-center">
          <a 
            href="https://www.movingto.com/portugal-golden-visa-funds" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
          >
            Browse All Portugal Golden Visa Funds
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
        
        <FAQsContent />
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQs;
