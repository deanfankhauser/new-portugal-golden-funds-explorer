
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import DecisionBandHeader from './DecisionBandHeader';
import HistoricalPerformanceChart from './HistoricalPerformanceChart';
import TrustPracticalityCards from './TrustPracticalityCards';
import KeyTermsTable from './KeyTermsTable';
import StrategyPortfolioSection from './StrategyPortfolioSection';
import RiskAssessmentSection from './RiskAssessmentSection';
import DocumentsDisclosures from './DocumentsDisclosures';
import StickyNavigation from './StickyNavigation';
import FloatingTableOfContents from './FloatingTableOfContents';
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
import RegulatoryComplianceInfo from './RegulatoryComplianceInfo';
import FeeDisclaimer from './FeeDisclaimer';
import { isFundGVEligible } from '../../data/services/gv-eligibility-service';

import FundDataFreshness from './FundDataFreshness';
import BackToFundsButton from './BackToFundsButton';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, TrendingUp } from 'lucide-react';
import { tagToSlug } from '@/lib/utils';
import { VerifiedReviews } from './reviews/VerifiedReviews';
import FundBreadcrumbs from './FundBreadcrumbs';
import { FundEditButton } from '../fund-editing/FundEditButton';

interface FundDetailsContentProps {
  fund: Fund;
}

const FundDetailsContent: React.FC<FundDetailsContentProps> = ({ fund }) => {
  const isGVEligible = isFundGVEligible(fund);
  
  // Filter out "Golden Visa Eligible" tag for non-GV funds
  const displayTags = fund.tags.filter(tag => 
    tag !== 'Golden Visa Eligible' || isGVEligible
  );
  return (
    <>
      {/* Sticky Navigation */}
      <StickyNavigation fund={fund} />
      
      <div className="space-y-6 md:space-y-8 pb-20 md:pb-8">
        {/* Breadcrumbs */}
        <FundBreadcrumbs fund={fund} />
        
        {/* Back to Funds Button */}
        <BackToFundsButton />
        
        {/* Above-the-fold Decision Band */}
        <DecisionBandHeader fund={fund} />
        
        {/* Historical Performance Chart - Full Width */}
        <HistoricalPerformanceChart historicalPerformance={fund.historicalPerformance} />
        
        {/* Just Below the Fold - Trust + Practicality */}
        <TrustPracticalityCards fund={fund} />
        
        {/* Mid-page Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <KeyTermsTable fund={fund} />
          <div>
            <StrategyPortfolioSection fund={fund} />
          </div>
        </div>
        
        {/* Risk Assessment Section */}
        <RiskAssessmentSection fund={fund} />
        
        {/* Documents & Disclosures */}
        <DocumentsDisclosures fund={fund} />

      <div className="bg-card rounded-xl md:rounded-2xl shadow-md border border-border overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <div className="p-4 md:p-6 lg:p-10 space-y-6 md:space-y-8 lg:space-y-10">
          {/* Main content with tabs - Detailed Information */}
          <FundTabsLazySection fund={fund} />
          
          {/* Data Quality Indicators - Trust Signals */}
          <FundDataFreshness fund={fund} />
          
          {/* Fee Disclaimer */}
          <FeeDisclaimer />
          
          {/* Regulatory & Compliance Information */}
          <RegulatoryComplianceInfo fund={fund} />
          
          {/* Fund Edit Button - Community Editing */}
          <div className="flex justify-center">
            <FundEditButton fund={fund} />
          </div>
          
          {/* Structure description and Report Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <FundStructureInfo fund={fund} />
            <ReportButton fundName={fund.name} />
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
          
          {/* Tags Section - Bottom */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Fund Tags</h3>
            <div className="flex flex-wrap gap-2">
              {displayTags.map(tag => (
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
      
      {/* Floating TOC (Mobile only) */}
      <FloatingTableOfContents fund={fund} />
    </>
  );
};

export default FundDetailsContent;
