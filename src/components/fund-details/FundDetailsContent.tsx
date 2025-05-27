
import React from 'react';
import { Fund } from '../../data/funds';
import FundHeader from './FundHeader';
import FundMetrics from './FundMetrics';
import FundTabsSection from './FundTabsSection';
import IntroductionButton from './IntroductionButton';
import { formatCurrency } from './utils/formatters';
import FundStructureInfo from './FundStructureInfo';
import ReportButton from './ReportButton';
import FundSizeFormatter from './FundSizeFormatter';
import InvestorNotice from './InvestorNotice';
import FundFAQSection from './FundFAQSection';

interface FundDetailsContentProps {
  fund: Fund;
}

const FundDetailsContent: React.FC<FundDetailsContentProps> = ({ fund }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        {/* Fund Header Section with built-in CTA */}
        <FundHeader fund={fund} />

        <div className="p-6 md:p-10 space-y-10">
          {/* Structure description and Report Button */}
          <div className="flex items-center justify-between">
            <FundStructureInfo fund={fund} />
            <ReportButton fundName={fund.name} />
          </div>
          
          {/* Grid layout for key metrics */}
          <FundMetrics 
            fund={fund} 
            formatCurrency={formatCurrency} 
            formatFundSize={() => <FundSizeFormatter fund={fund} />} 
          />
          
          {/* Main content with tabs */}
          <FundTabsSection fund={fund} />
          
          {/* Investor Notice */}
          <InvestorNotice />
          
          {/* Introduction Button (full version at bottom) */}
          <IntroductionButton variant="full" />
        </div>
      </div>
      
      {/* FAQ Section */}
      <FundFAQSection fund={fund} />
    </div>
  );
};

export default FundDetailsContent;
