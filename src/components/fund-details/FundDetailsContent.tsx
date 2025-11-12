
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
import { FundEnquirySection } from './FundEnquirySection';
import ContactSidebar from './ContactSidebar';

interface FundDetailsContentProps {
  fund: Fund;
}

const FundDetailsContent: React.FC<FundDetailsContentProps> = ({ fund }) => {
  const isGVEligible = isFundGVEligible(fund);
  
  // Filter out "Golden Visa Eligible" tag for non-GV funds
  const displayTags = fund.tags.filter(tag => 
    tag !== 'Golden Visa Eligible' || (isGVEligible && fund.isVerified)
  );
  return (
    <>
      {/* Sticky Navigation */}
      <StickyNavigation fund={fund} />
      
      <div className="space-y-6 md:space-y-8">
        {/* Breadcrumbs */}
        <FundBreadcrumbs fund={fund} />

        {/* Header - Full Width */}
        <DecisionBandHeader fund={fund} />

        {/* Two Column Layout - Main Content + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 md:gap-8">
          {/* Left Column - Main Content */}
          <div className="space-y-6 md:space-y-8">
            <FundSnapshotCard fund={fund} />
        
            <HistoricalPerformanceChart historicalPerformance={fund.historicalPerformance} />
            
            {/* Main Content Card - Full Width */}
            <div className="bg-card rounded-xl md:rounded-2xl shadow-md border border-border overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                  <div className="p-4 md:p-6 lg:p-10 space-y-6 md:space-y-8 lg:space-y-12">
                    
                    {/* Fund Overview Section */}
                    <section id="fund-overview" className="scroll-mt-28 md:scroll-mt-24">
                      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">Fund Overview</h2>
                      <div className="space-y-4 md:space-y-6">
                        <FundDescription description={fund.detailedDescription} />
                        <RegulatoryIdentifiers fund={fund} />
                        <FundManager managerName={fund.managerName} />
                      </div>
                    </section>

                    {/* Key Terms Section */}
                    <section id="key-terms-strategy" className="scroll-mt-28 md:scroll-mt-24">
                      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">Key Terms</h2>
                      <KeyTermsTable fund={fund} />
                    </section>


                    {/* Financial Details Section */}
                    <section id="financial-details" className="scroll-mt-28 md:scroll-mt-24">
                      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">Financial Details</h2>
                      <div className="space-y-6 md:space-y-8">
                        <FeeStructure fund={fund} formatPercentage={formatPercentage} />
                        <GeographicAllocation allocations={fund.geographicAllocation} formatPercentage={formatPercentage} />
                        <RedemptionTerms redemptionTerms={fund.redemptionTerms} />
                      </div>
                    </section>

                    {/* Fund Structure Section */}
                    <section id="fund-structure" className="scroll-mt-28 md:scroll-mt-24">
                      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">Fund Structure</h2>
                      <div className="space-y-4 md:space-y-6">
                        <FundCategory category={fund.category} />
                        <RegulatoryComplianceInfo fund={fund} />
                      </div>
                    </section>

                    {/* Team Information Section */}
                    <section id="team-information" className="scroll-mt-28 md:scroll-mt-24">
                      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">Team Information</h2>
                      <TeamSection team={fund.team} />
                    </section>


                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-success/10 to-success/5 p-4 md:p-6 rounded-lg border border-success/30">
                      <div className="text-center">
                        <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">Want to calculate your potential returns?</h3>
                        <p className="text-xs md:text-sm text-muted-foreground mb-4">Use our ROI calculator to estimate potential returns based on historical performance</p>
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                          <Button asChild className="bg-success hover:bg-success/90 text-success-foreground h-11">
                            <Link to="/roi-calculator">
                              <Calculator className="mr-2 h-4 w-4" />
                              Calculate Returns
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="border-success text-success hover:bg-success/10 h-11">
                            <Link to="/">
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
          
          {/* Right Column - Contact Sidebar (Desktop Only) */}
          <ContactSidebar fund={fund} />
        </div>
      </div>
      
      
      {/* Bottom Sections with Proper Spacing */}
      <div className="space-y-8 md:space-y-12 mt-8 md:mt-12">
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
        
        {/* Enquiry Form Section - Inline at bottom */}
        <FundEnquirySection fund={fund} />
      </div>
      
      {/* Floating TOC (Mobile only) */}
      <FloatingTableOfContents fund={fund} />
    </>
  );
};

export default FundDetailsContent;
