
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import DecisionBandHeader from './DecisionBandHeader';
import FundSnapshotCard from './FundSnapshotCard';
import HistoricalPerformanceChart from './HistoricalPerformanceChart';
import TrustPracticalityCards from './TrustPracticalityCards';
import StickyNavigation from './StickyNavigation';
import FloatingTableOfContents from './FloatingTableOfContents';
import InvestorNotice from './InvestorNotice';
import FundFAQSection from './FundFAQSection';
import PremiumCTA from '../cta/PremiumCTA';
import ROICalculator from './ROICalculator';
import AlternativeFunds from './AlternativeFunds';
import RelatedFunds from './RelatedFunds';
import FundComparisonSuggestions from './FundComparisonSuggestions';
import { isFundGVEligible } from '../../data/services/gv-eligibility-service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calculator, TrendingUp, MessageSquare, Mail } from 'lucide-react';
import { tagToSlug } from '@/lib/utils';
import { FundEnquiryModal } from './FundEnquiryModal';

import FundBreadcrumbs from './FundBreadcrumbs';
import { FundEditButton } from '../fund-editing/FundEditButton';
import FundSideNavigation from './FundSideNavigation';

// Import tab components directly
import FundDescription from './FundDescription';
import FundManager from './FundManager';
import RegulatoryIdentifiers from './RegulatoryIdentifiers';
import KeyTermsTable from './KeyTermsTable';
import FundCategory from './FundCategory';
import FeeStructure from './FeeStructure';
import GeographicAllocation from './GeographicAllocation';
import RedemptionTerms from './RedemptionTerms';
import RegulatoryComplianceInfo from './RegulatoryComplianceInfo';
import TeamSection from './TeamSection';
import { formatPercentage } from './utils/formatters';

interface FundDetailsContentProps {
  fund: Fund;
}

const FundDetailsContent: React.FC<FundDetailsContentProps> = ({ fund }) => {
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const isGVEligible = isFundGVEligible(fund);
  
  // Filter out "Golden Visa Eligible" tag for non-GV funds
  const displayTags = fund.tags.filter(tag => 
    tag !== 'Golden Visa Eligible' || (isGVEligible && fund.isVerified)
  );
  return (
    <>
      {/* Sticky Navigation */}
      <StickyNavigation fund={fund} />
      
      <div className="space-y-8">
        {/* Breadcrumbs */}
        <FundBreadcrumbs fund={fund} />

        {/* Header and Snapshot - Single Column */}
        <div className="space-y-6">
          <DecisionBandHeader fund={fund} />
          <FundSnapshotCard fund={fund} />
        </div>
        
        {/* Historical Performance Chart - Full Width */}
        <HistoricalPerformanceChart historicalPerformance={fund.historicalPerformance} />
        
        {/* Just Below the Fold - Trust + Practicality */}
        <TrustPracticalityCards fund={fund} />
        
        {/* Main Content Layout with Side Navigation */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Side Navigation */}
          <div className="xl:block">
            <FundSideNavigation />
          </div>
          
          {/* Main Content Area */}
          <div className="xl:col-span-3">
            <div className="bg-card rounded-xl md:rounded-2xl shadow-md border border-border overflow-hidden transition-shadow duration-300 hover:shadow-lg">
              <div className="p-4 md:p-6 lg:p-10 space-y-8 md:space-y-12">
                
                {/* Fund Overview Section */}
                <section id="fund-overview" className="scroll-mt-24">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">Fund Overview</h2>
                  <div className="space-y-6">
                    <FundDescription description={fund.detailedDescription} />
                    <RegulatoryIdentifiers fund={fund} />
                    <FundManager managerName={fund.managerName} />
                  </div>
                </section>

                {/* Key Terms Section */}
                <section id="key-terms-strategy" className="scroll-mt-24">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">Key Terms</h2>
                  <KeyTermsTable fund={fund} />
                </section>


                {/* Financial Details Section */}
                <section id="financial-details" className="scroll-mt-24">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">Financial Details</h2>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <FeeStructure fund={fund} formatPercentage={formatPercentage} />
                      <RedemptionTerms redemptionTerms={fund.redemptionTerms} />
                    </div>
                    <div className="space-y-6">
                      <GeographicAllocation allocations={fund.geographicAllocation} formatPercentage={formatPercentage} />
                    </div>
                  </div>
                </section>

                {/* Fund Structure Section */}
                <section id="fund-structure" className="scroll-mt-24">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">Fund Structure</h2>
                  <div className="space-y-6">
                    <FundCategory category={fund.category} />
                    <RegulatoryComplianceInfo fund={fund} />
                  </div>
                </section>

                {/* Team Information Section */}
                <section id="team-information" className="scroll-mt-24">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">Team Information</h2>
                  <TeamSection team={fund.team} />
                </section>

                {/* Get in Touch CTA */}
                <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border-2 border-primary/20">
                  <div className="p-6 md:p-8 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">
                      Have questions about this fund?
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                      Get in touch with the fund manager directly. They typically respond within 24-48 hours 
                      to answer your questions and provide detailed information.
                    </p>
                    <Button 
                      size="lg" 
                      className="gap-2 shadow-lg mt-4"
                      onClick={() => setEnquiryModalOpen(true)}
                    >
                      <MessageSquare className="h-5 w-5" />
                      Get in Touch with Fund Manager
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Join over 200+ investors who have enquired about funds on our platform
                    </p>
                  </div>
                </Card>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-success/10 to-success/5 p-4 md:p-6 rounded-lg border border-success/30">
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">Want to calculate your potential returns?</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-4">Use our ROI calculator to estimate potential returns based on historical performance</p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button asChild className="bg-success hover:bg-success/90 text-success-foreground">
                        <Link to="/roi-calculator">
                          <Calculator className="mr-2 h-4 w-4" />
                          Calculate Returns
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
          </div>
        </div>
      </div>
      
      
      {/* Bottom Sections with Proper Spacing */}
      <div className="space-y-8 md:space-y-12">
        {/* Related Funds Section */}
        <RelatedFunds currentFund={fund} />
        
        {/* Alternative Funds Section */}
        <AlternativeFunds currentFund={fund} />
        
        {/* Fund Comparison Suggestions */}
        <FundComparisonSuggestions currentFund={fund} />
        
        {/* ROI Calculator */}
        <ROICalculator fund={fund} />
        
        {/* FAQ Section */}
        <FundFAQSection fund={fund} />
      </div>
      
      {/* Floating TOC (Mobile only) */}
      <FloatingTableOfContents fund={fund} />
      
      {/* Enquiry Modal */}
      <FundEnquiryModal 
        open={enquiryModalOpen} 
        onOpenChange={setEnquiryModalOpen} 
        fund={fund} 
      />
    </>
  );
};

export default FundDetailsContent;
