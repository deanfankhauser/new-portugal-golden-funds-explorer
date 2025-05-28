
import React from 'react';
import { Link } from 'react-router-dom';
import { generateFundComparisons } from '../data/services/comparison-service';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { GitCompare } from 'lucide-react';

const ComparisonsHub = () => {
  const comparisons = generateFundComparisons();

  React.useEffect(() => {
    document.title = "Fund Comparisons | Portugal Golden Visa Investment Funds";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Compare Portugal Golden Visa investment funds side-by-side. Detailed analysis of fees, returns, minimum investments, and more across all available funds.'
      );
    }

    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Fund Comparisons</h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl">
            Compare Portugal Golden Visa investment funds side-by-side to make informed investment decisions. 
            Our detailed comparisons cover fees, returns, minimum investments, geographic allocation, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {comparisons.map((comparison) => (
            <Card key={comparison.slug} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  <GitCompare className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#EF4444]" />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">Fund Comparison</span>
                </div>
                
                <h2 className="text-base sm:text-lg font-bold mb-3 leading-tight">
                  {comparison.fund1.name} vs {comparison.fund2.name}
                </h2>
                
                <div className="space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span className="text-right">{comparison.fund1.category} vs {comparison.fund2.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Investment:</span>
                    <span>€{Math.min(comparison.fund1.minimumInvestment, comparison.fund2.minimumInvestment).toLocaleString()}+</span>
                  </div>
                </div>
                
                <Link 
                  to={`/compare/${comparison.slug}`}
                  className="inline-flex items-center justify-center w-full bg-[#EF4444] hover:bg-[#EF4444]/90 text-white px-3 sm:px-4 py-2 rounded-md transition-colors duration-300 font-medium text-sm sm:text-base"
                >
                  Compare Funds
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SEO Content */}
        <div className="mt-10 sm:mt-12 bg-white rounded-lg shadow-sm border p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Why Compare Portugal Golden Visa Funds?</h2>
          <div className="prose max-w-none text-gray-700 text-sm sm:text-base">
            <p className="mb-3 sm:mb-4">
              Choosing the right Portugal Golden Visa investment fund is crucial for your residency application and financial goals. 
              Our comparison tool helps you evaluate funds across multiple criteria:
            </p>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-sm sm:text-base">
              <li><strong>Investment Requirements:</strong> Minimum investment amounts and fee structures</li>
              <li><strong>Returns:</strong> Target returns and historical performance</li>
              <li><strong>Risk Profiles:</strong> Investment strategies and risk levels</li>
              <li><strong>Geographic Focus:</strong> Regional allocation and diversification</li>
              <li><strong>Fund Management:</strong> Team experience and track record</li>
              <li><strong>Liquidity Terms:</strong> Redemption frequency and lock-up periods</li>
            </ul>
            <p className="text-sm sm:text-base">
              All funds listed are eligible for the Portugal Golden Visa program and meet the €350,000 minimum investment requirement 
              when combined with a property purchase in a low-density area.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComparisonsHub;
