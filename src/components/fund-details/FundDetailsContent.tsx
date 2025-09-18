
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import DecisionBandHeader from './DecisionBandHeader';
import PerformanceModule from './PerformanceModule';
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
import EnhancedGVEligibilityBadge from './EnhancedGVEligibilityBadge';
import EligibilityBasisInfo from './EligibilityBasisInfo';
import RegulatoryComplianceInfo from './RegulatoryComplianceInfo';
import FeeDisclaimer from './FeeDisclaimer';
import EligibilityBasisDisplayLine from './EligibilityBasisDisplayLine';
import { isFundGVEligible } from '../../data/services/gv-eligibility-service';

import FundDataFreshness from './FundDataFreshness';
import BackToFundsButton from './BackToFundsButton';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, TrendingUp } from 'lucide-react';
import DataFreshnessWarning from '../common/DataFreshnessWarning';
import { tagToSlug } from '@/lib/utils';
import { VerifiedReviews } from './reviews/VerifiedReviews';
import { DATA_AS_OF_LABEL } from '../../utils/constants';
import FundBreadcrumbs from './FundBreadcrumbs';
import FundDataFreshnessDisplay from './FundDataFreshnessDisplay';
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
        
        {/* Performance Module - Full Width */}
        <PerformanceModule fund={fund} />
        
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
          {/* Fund Edit Button - Community Editing */}
          <div className="flex justify-center">
            <FundEditButton fund={fund} />
          </div>
          
          {/* Main content with tabs - Detailed Information */}
          <FundTabsLazySection fund={fund} />
          
          {/* Fund Edit Button - Community Editing */}
          <div className="flex justify-center">
            <FundEditButton fund={fund} />
          </div>
          
          {/* Data Quality Indicators - Trust Signals */}
          <FundDataFreshness fund={fund} />
          <DataFreshnessWarning fund={fund} />
          <FundDataFreshnessDisplay fund={fund} />
          
          {/* Enhanced GV Eligibility Badge */}
          <EnhancedGVEligibilityBadge fund={fund} showDetails={true} />
          
          {/* Eligibility Basis Display Line */}
          <EligibilityBasisDisplayLine fund={fund} />
          
          {/* Eligibility Basis Information */}
          <EligibilityBasisInfo fund={fund} />
          
          {/* Fee Disclaimer */}
          <FeeDisclaimer />
          
          {/* Regulatory & Compliance Information */}
          <RegulatoryComplianceInfo fund={fund} />
          
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
              Appears GV-eligible {DATA_AS_OF_LABEL} based on manager documentation. GV still requires €500,000 total. Always verify with your lawyer and the fund manager.
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
