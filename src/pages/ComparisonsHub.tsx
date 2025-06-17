
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import ComparisonsHubBreadcrumbs from '../components/comparisons-hub/ComparisonsHubBreadcrumbs';
import ComparisonsHubHeader from '../components/comparisons-hub/ComparisonsHubHeader';
import ComparisonsList from '../components/comparisons-hub/ComparisonsList';

const ComparisonsHub = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="comparisons-hub" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <ComparisonsHubBreadcrumbs />
        <ComparisonsHubHeader />
        <ComparisonsList />
      </main>
      
      <Footer />
    </div>
  );
};

export default ComparisonsHub;
