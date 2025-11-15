
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { useComparison } from '../contexts/ComparisonContext';
import ComparisonTable from '../components/comparison/ComparisonTable';
import EmptyComparison from '../components/comparison/EmptyComparison';
import ComparisonBreadcrumbs from '../components/comparison/ComparisonBreadcrumbs';

const ComparisonPage = () => {
  const { compareFunds, clearComparison } = useComparison();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="comparison" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <ComparisonBreadcrumbs />
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Compare Portugal Golden Visa Investment Funds</h1>
            {compareFunds.length > 0 && (
              <button
                onClick={clearComparison}
                className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-md transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <p className="text-gray-600 mb-4">
            {compareFunds.length > 0 
              ? `Comparing ${compareFunds.length} selected funds side by side.`
              : 'Select funds to compare from the fund listings.'
            }
          </p>
          
          {compareFunds.length === 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-3 text-foreground">How to Compare Portugal Golden Visa Investment Funds</h2>
              <p className="text-muted-foreground mb-4">
                Our comprehensive fund comparison tool helps you analyze Portugal Golden Visa investment funds side-by-side. 
                Compare key metrics including minimum investment requirements, management fees, target returns, risk profiles, 
                and fund performance to make informed investment decisions.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <h3 className="font-medium mb-2">Key Comparison Metrics:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Minimum investment amounts</li>
                    <li>Management and performance fees</li>
                    <li>Expected returns and risk levels</li>
                    <li>Geographic allocation strategies</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Investment Categories:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Capital Risk Funds</li>
                    <li>Mixed Investment Strategies</li>
                    <li>Specialized Sector Funds</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
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
