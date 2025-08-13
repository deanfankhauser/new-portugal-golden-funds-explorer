
import React from 'react';
import { Link } from 'react-router-dom';
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
import PremiumCTA from '../cta/PremiumCTA';
import ROICalculator from './ROICalculator';
import AlternativeFunds from './AlternativeFunds';
import RelatedFunds from './RelatedFunds';
import FundRiskScore from './FundRiskScore';
import ProcessingTimeTracker from './ProcessingTimeTracker';
import BackToFundsButton from './BackToFundsButton';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, TrendingUp } from 'lucide-react';

interface FundDetailsContentProps {
  fund: Fund;
}

const FundDetailsContent: React.FC<FundDetailsContentProps> = ({ fund }) => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Back to Funds Button */}
      <BackToFundsButton />
      
      <div className="bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        {/* Fund Header Section with built-in CTA */}
        <FundHeader fund={fund} />

        <div className="p-4 md:p-6 lg:p-10 space-y-6 md:space-y-8 lg:space-y-10">
          {/* Structure description and Report Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <FundStructureInfo fund={fund} />
            <ReportButton fundName={fund.name} />
          </div>
          
          {/* Grid layout for key metrics */}
          <FundMetrics 
            fund={fund} 
            formatCurrency={formatCurrency} 
            formatFundSize={() => <FundSizeFormatter fund={fund} />} 
          />
          
          {/* Fund Risk Score */}
          <FundRiskScore fund={fund} />
          
          {/* Processing Time Tracker */}
          <ProcessingTimeTracker fund={fund} />
          
          {/* Fund Quiz CTA */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 md:p-6 rounded-lg border border-green-200">
            <div className="text-center">
              <h3 className="font-semibold text-green-900 mb-2 text-sm md:text-base">Want to see how this fund compares to others?</h3>
              <p className="text-xs md:text-sm text-green-700 mb-4">Take our quiz to get personalized recommendations based on your investment profile</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link to="/fund-quiz">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Take Fund Quiz
                  </Button>
                </Link>
                <Link to="/index">
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Fund Index
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Premium CTA after metrics */}
          <PremiumCTA variant="full" location={`fund-details-${fund.id}`} />
          
          {/* Main content with tabs */}
          <FundTabsSection fund={fund} />
          
          {/* Investor Notice */}
          <InvestorNotice />
          
          {/* Introduction Button (full version at bottom) */}
          <IntroductionButton variant="full" />
        </div>
      </div>
      
      {/* Related Funds Section */}
      <RelatedFunds currentFund={fund} />
      
      {/* Alternative Funds Section */}
      <AlternativeFunds currentFund={fund} />
      
      {/* ROI Calculator */}
      <ROICalculator fund={fund} />
      
      {/* FAQ Section */}
      <FundFAQSection fund={fund} />
    </div>
  );
};

export default FundDetailsContent;
