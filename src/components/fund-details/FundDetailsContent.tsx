
import React from 'react';
import { Fund } from '../../data/funds';
import FundHeader from './FundHeader';
import FundMetrics from './FundMetrics';
import FundCategory from './FundCategory';
import FeeStructure from './FeeStructure';
import GeographicAllocation from './GeographicAllocation';
import FundManager from './FundManager';
import TeamSection from './TeamSection';
import FundDescription from './FundDescription';
import DocumentsSection from './DocumentsSection';
import IntroductionButton from './IntroductionButton';
import RedemptionTerms from './RedemptionTerms';
import { formatCurrency, formatPercentage } from './utils/formatters';

interface FundDetailsContentProps {
  fund: Fund;
}

const FundDetailsContent: React.FC<FundDetailsContentProps> = ({ fund }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      {/* Fund Header Section with built-in CTA */}
      <FundHeader fund={fund} />

      <div className="p-6 md:p-10 space-y-14">
        {/* Grid layout for key metrics */}
        <FundMetrics fund={fund} formatCurrency={formatCurrency} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Fund Category Section */}
            <FundCategory category={fund.category} />

            {/* Fee Structure Section */}
            <FeeStructure fund={fund} formatPercentage={formatPercentage} />
            
            {/* Redemption Terms Section */}
            <RedemptionTerms redemptionTerms={fund.redemptionTerms} />
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
        
        {/* Introduction Button (full version at bottom) */}
        <IntroductionButton variant="full" />
      </div>
    </div>
  );
};

export default FundDetailsContent;
