
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { useComparison } from '../contexts/ComparisonContext';
import ComparisonTable from '../components/comparison/ComparisonTable';
import EmptyComparison from '../components/comparison/EmptyComparison';
import ComparisonBreadcrumbs from '../components/comparison/ComparisonBreadcrumbs';

const ComparisonPage = () => {
  const { compareFunds } = useComparison();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="comparison" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <ComparisonBreadcrumbs />
          
          <h1 className="text-3xl font-bold mb-4">Compare Funds</h1>
          <p className="text-gray-600">
            {compareFunds.length > 0 
              ? `Comparing ${compareFunds.length} selected funds side by side.`
              : 'Select funds to compare from the fund listings.'
            }
          </p>
        </div>

        {compareFunds.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <ComparisonTable funds={compareFunds} />
          </div>
        ) : (
          <EmptyComparison />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ComparisonPage;
