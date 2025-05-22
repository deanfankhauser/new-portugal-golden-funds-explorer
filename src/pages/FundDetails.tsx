
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFundById } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

// Import our components
import FundHeader from '../components/fund-details/FundHeader';
import FundCategory from '../components/fund-details/FundCategory';
import FundMetrics from '../components/fund-details/FundMetrics';
import FeeStructure from '../components/fund-details/FeeStructure';
import GeographicAllocation from '../components/fund-details/GeographicAllocation';
import FundManager from '../components/fund-details/FundManager';
import TeamSection from '../components/fund-details/TeamSection';
import FundDescription from '../components/fund-details/FundDescription';
import DocumentsSection from '../components/fund-details/DocumentsSection';
import IntroductionButton from '../components/fund-details/IntroductionButton';
import FundWebsite from '../components/fund-details/FundWebsite';
import { formatCurrency, formatPercentage } from '../components/fund-details/utils/formatters';

const FundDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fund = id ? getFundById(id) : undefined;

  useEffect(() => {
    if (!fund) {
      // If fund not found, redirect to homepage
      navigate('/');
    }
    // Set page title for SEO
    if (fund) {
      document.title = `${fund.name} | Portugal Golden Visa Funds`;
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [fund, navigate]);

  if (!fund) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="flex items-center text-black hover:bg-[#f0f0f0] hover:text-black group transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to funds
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Fund Header Section */}
            <FundHeader fund={fund} />

            <div className="p-6 md:p-8 space-y-12">
              {/* Grid layout for key metrics */}
              <FundMetrics fund={fund} formatCurrency={formatCurrency} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  {/* Fund Category Section */}
                  <FundCategory category={fund.category} />

                  {/* Fee Structure Section */}
                  <FeeStructure fund={fund} formatPercentage={formatPercentage} />
                </div>

                <div className="space-y-8">
                  {/* Geographic Allocation Section */}
                  <GeographicAllocation 
                    allocations={fund.geographicAllocation} 
                    formatPercentage={formatPercentage} 
                  />

                  {/* Fund Manager Section */}
                  <FundManager 
                    managerName={fund.managerName} 
                    managerLogo={fund.managerLogo} 
                  />
                </div>
              </div>

              {/* Fund Description */}
              <FundDescription description={fund.detailedDescription} />

              {/* Team Section */}
              <TeamSection team={fund.team} />

              {/* Documents Section */}
              <DocumentsSection documents={fund.documents} />
              
              {/* Fund Website */}
              <FundWebsite websiteUrl={fund.websiteUrl} />

              {/* Introduction Button */}
              <IntroductionButton />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundDetails;
