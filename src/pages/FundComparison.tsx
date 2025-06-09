
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComparisonBySlug } from '../data/services/comparison-service';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import ComparisonTable from '../components/comparison/ComparisonTable';
import ComparisonUpgradeCTA from '../components/cta/ComparisonUpgradeCTA';
import { useComparisonStructuredData } from '../hooks/useComparisonStructuredData';
import PageSEO from '../components/common/PageSEO';

const FundComparison = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const comparison = slug ? getComparisonBySlug(slug) : null;

  // If comparison not found, redirect to comparisons hub
  if (!comparison) {
    navigate('/comparisons');
    return null;
  }

  const { fund1, fund2 } = comparison;
  const funds = [fund1, fund2];
  const comparisonTitle = `${fund1.name} vs ${fund2.name}`;

  // Add structured data for fund vs fund comparison
  useComparisonStructuredData(funds, 'fund-vs-fund');

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="fund-comparison" comparisonTitle={comparisonTitle} />
      
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/comparisons')} 
            className="flex items-center text-black hover:bg-[#f0f0f0] text-sm sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Back to comparisons
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
            {fund1.name} vs {fund2.name}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Detailed comparison of two Portugal Golden Visa investment funds
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Upgrade CTA */}
          <ComparisonUpgradeCTA />
          
          {/* Comparison Table */}
          <ComparisonTable funds={[fund1, fund2]} />
          
          {/* Summary Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Comparison Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[#EF4444]">{fund1.name}</h3>
                <ul className="space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                  <li><strong>Category:</strong> {fund1.category}</li>
                  <li><strong>Minimum Investment:</strong> €{fund1.minimumInvestment.toLocaleString()}</li>
                  <li><strong>Target Return:</strong> {fund1.returnTarget}</li>
                  <li><strong>Management Fee:</strong> {fund1.managementFee}%</li>
                  <li><strong>Fund Manager:</strong> {fund1.managerName}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[#EF4444]">{fund2.name}</h3>
                <ul className="space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                  <li><strong>Category:</strong> {fund2.category}</li>
                  <li><strong>Minimum Investment:</strong> €{fund2.minimumInvestment.toLocaleString()}</li>
                  <li><strong>Target Return:</strong> {fund2.returnTarget}</li>
                  <li><strong>Management Fee:</strong> {fund2.managementFee}%</li>
                  <li><strong>Fund Manager:</strong> {fund2.managerName}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundComparison;
