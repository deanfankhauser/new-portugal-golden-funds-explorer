
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import FundHeader from './FundHeader';
import FundMetrics from './FundMetrics';
import FundTabsLazySection from './FundTabsLazySection';
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
import FundComparisonSuggestions from './FundComparisonSuggestions';
import EnhancedGVEligibilityBadge from './EnhancedGVEligibilityBadge';

import FundDataFreshness from './FundDataFreshness';
import BackToFundsButton from './BackToFundsButton';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, TrendingUp } from 'lucide-react';
import DataFreshnessWarning from '../common/DataFreshnessWarning';
import { tagToSlug } from '@/lib/utils';
import { VerifiedReviews } from './reviews/VerifiedReviews';

interface FundDetailsContentProps {
  fund: Fund;
}

const FundDetailsContent: React.FC<FundDetailsContentProps> = ({ fund }) => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Back to Funds Button */}
      <BackToFundsButton />
      
      <div className="bg-card rounded-xl md:rounded-2xl shadow-md border border-border overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        {/* Fund Header Section with built-in CTA */}
        <FundHeader fund={fund} />

        <div className="p-4 md:p-6 lg:p-10 space-y-6 md:space-y-8 lg:space-y-10">
          {/* Main content with tabs - Detailed Information */}
          <FundTabsLazySection fund={fund} />
          
          {/* Key Financial Metrics - Most Important */}
          <FundMetrics 
            fund={fund} 
            formatCurrency={formatCurrency} 
            formatFundSize={() => <FundSizeFormatter fund={fund} />} 
          />
          
          {/* Data Quality Indicators - Trust Signals */}
          <FundDataFreshness fund={fund} />
          <DataFreshnessWarning fund={fund} />
          
          {/* Enhanced GV Eligibility Badge */}
          <EnhancedGVEligibilityBadge fund={fund} showDetails={true} />
          
          {/* Structure description and Report Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <FundStructureInfo fund={fund} />
            <ReportButton fundName={fund.name} />
          </div>
          
          {/* Marketing CTAs - Lower Priority */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 md:p-6 rounded-lg border border-primary/20">
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">Portugal Golden Visa Qualified Fund</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-4">
                Lawyers at Movingto have done due diligence on this firm and can confirm it meets the requirements for the Portugal Golden Visa
              </p>
              <a 
                href="https://movingto.com/pt/portugal-golden-visa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200"
              >
                Learn about Golden Visa requirements
                <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-r from-success/10 to-success/5 p-4 md:p-6 rounded-lg border border-success/30">
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">Want to see how this fund compares to others?</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-4">Take our quiz to get personalized recommendations based on your investment profile</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button asChild className="bg-success hover:bg-success/90 text-success-foreground">
                  <Link to="/fund-quiz">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Take Fund Quiz
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-success text-success hover:bg-success/10">
                  <Link to="/index">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Fund Index
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <PremiumCTA variant="full" location={`fund-details-${fund.id}`} />
          
          {/* Legal and Administrative - Bottom */}
          <InvestorNotice />
          <IntroductionButton variant="full" />
          
          {/* Tags Section - Bottom */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Fund Tags</h3>
            <div className="flex flex-wrap gap-2">
              {fund.tags.map(tag => (
                <Link 
                  key={tag} 
                  to={`/tags/${tagToSlug(tag)}`}
                  className="bg-card hover:bg-primary hover:text-primary-foreground text-primary border border-primary px-2 py-1 md:px-3 md:py-1 rounded-full transition-all duration-300 shadow-sm text-xs md:text-sm font-medium"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Funds Section */}
      <RelatedFunds currentFund={fund} />
      
      {/* Alternative Funds Section */}
      <AlternativeFunds currentFund={fund} />
      
      {/* Fund Comparison Suggestions */}
      <FundComparisonSuggestions currentFund={fund} />
      
      {/* ROI Calculator */}
      <ROICalculator fund={fund} />
      
      {/* Verified Reviews Section */}
      <VerifiedReviews fund={fund} />
      
      {/* FAQ Section */}
      <FundFAQSection fund={fund} />
    </div>
  );
};

export default FundDetailsContent;
