
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="flex items-center text-[#EF4444] hover:text-[#EF4444]/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to funds
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Fund Header Section */}
          <FundHeader fund={fund} />

          {/* Fund Category Section */}
          <FundCategory category={fund.category} />

          {/* Key Metrics */}
          <FundMetrics fund={fund} formatCurrency={formatCurrency} />

          {/* Fee Structure Section */}
          <FeeStructure fund={fund} formatPercentage={formatPercentage} />

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

          {/* Team Section */}
          <TeamSection team={fund.team} />

          {/* Fund Description */}
          <FundDescription description={fund.detailedDescription} />

          {/* Documents Section */}
          <DocumentsSection documents={fund.documents} />

          {/* Introduction Button */}
          <IntroductionButton />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundDetails;
