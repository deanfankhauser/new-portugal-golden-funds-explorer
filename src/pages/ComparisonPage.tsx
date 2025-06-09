
import React from 'react';
import { useComparison } from '../contexts/ComparisonContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ComparisonTable from '../components/comparison/ComparisonTable';
import EmptyComparison from '../components/comparison/EmptyComparison';
import ComparisonUpgradeCTA from '../components/cta/ComparisonUpgradeCTA';
import { useComparisonStructuredData } from '../hooks/useComparisonStructuredData';
import PageSEO from '../components/common/PageSEO';

const ComparisonPage = () => {
  const { compareFunds, clearComparison } = useComparison();
  const navigate = useNavigate();

  // Add structured data for comparison page
  useComparisonStructuredData(compareFunds, 'comparison');

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="comparison" />
      
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center text-black hover:bg-[#f0f0f0] text-sm sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Back to funds
          </Button>
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Compare Funds</h1>
          {compareFunds.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <p className="text-gray-600 text-sm sm:text-base">
                Comparing {compareFunds.length} fund{compareFunds.length !== 1 ? 's' : ''}
              </p>
              <Button 
                variant="outline" 
                onClick={clearComparison}
                className="text-red-600 border-red-600 hover:bg-red-50 w-full sm:w-auto text-sm sm:text-base"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {compareFunds.length === 0 ? (
          <EmptyComparison />
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Upgrade CTA for advanced comparison features */}
            <ComparisonUpgradeCTA />
            
            <ComparisonTable funds={compareFunds} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ComparisonPage;
