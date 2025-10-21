import React from 'react';
import SEOAnalysisPanel from '@/components/seo/SEOAnalysisPanel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/common/PageSEO';

const SEOAnalysis: React.FC = () => {
  return (
    <>
      <PageSEO pageType="about" />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <SEOAnalysisPanel />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default SEOAnalysis;
