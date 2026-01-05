
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/types/funds';
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
import ContradictionWarningBanner from './ContradictionWarningBanner';
import { useFundContradictions } from '@/hooks/useFundContradictions';
import { useFundEditing } from '@/hooks/useFundEditing';

import FundBreadcrumbs from './FundBreadcrumbs';
import TechnicalSummaryBar from './TechnicalSummaryBar';
import DataVerifiedBadge from '../common/DataVerifiedBadge';
import VerificationTooltip from '../common/VerificationTooltip';


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
import FundSocialMediaSection from './FundSocialMediaSection';
import FundVideoSection from './FundVideoSection';
import FundNewsSection from './FundNewsSection';
import { useCompanyProfile, getCompanySocialMedia } from '@/hooks/useCompanyProfile';

interface TeamMemberSSR {
  id: string;
  slug: string;
  name: string;
  role: string;
  profile_id: string;
  linkedin_url?: string;
  photo_url?: string;
  bio?: string;
  company_name?: string;
}

interface FundDetailsContentProps {
  fund: Fund;
  initialFunds?: Fund[]; // For SSR internal linking
  initialTeamMembers?: TeamMemberSSR[]; // For SSR team member links
}

const FundDetailsContent: React.FC<FundDetailsContentProps> = ({ fund, initialFunds, initialTeamMembers }) => {
  const isGVEligible = isFundGVEligible(fund);
  
  // Fetch company profile to get social media
  const { data: companyProfile } = useCompanyProfile(fund.managerName);
  const companySocialMedia = getCompanySocialMedia(companyProfile);
  
  // Check if user has edit access to show contradiction warnings
  const { user, canEditFund } = useFundEditing();
  const [hasEditAccess, setHasEditAccess] = React.useState(false);
  
  React.useEffect(() => {
    if (user) {
      canEditFund(fund.id).then(setHasEditAccess);
    }
  }, [user, fund.id, canEditFund]);
  
  // Contradiction detection for admin/manager users
  const contradictionResult = useFundContradictions(fund);
  
  // Filter out "Golden Visa Eligible" tag for non-GV-intended funds (display will show compliance-safe label)
  const displayTags = fund.tags.filter(tag => 
    tag !== 'Golden Visa Eligible' || (isGVEligible && fund.isVerified)
  );
  return (
    <>
      {/* Sticky Navigation */}
      <StickyNavigation fund={fund} />
      
      <div className="space-y-6 md:space-y-8">
        {/* Contradiction Warning Banner - Only visible to admins/managers */}
        {hasEditAccess && contradictionResult.hasContradictions && (
          <ContradictionWarningBanner result={contradictionResult} />
        )}
        
        {/* Breadcrumbs */}
        <FundBreadcrumbs fund={fund} />
        
        {/* Header - Full Width */}
        <DecisionBandHeader fund={fund} />
        
        {/* Technical Summary Bar - Institutional Data Standard */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <TechnicalSummaryBar fund={fund} variant="full" />
          <div className="flex items-center gap-3">
            <VerificationTooltip isVerified={fund.isVerified} />
            <DataVerifiedBadge 
              lastVerifiedDate={fund.lastDataReviewDate || fund.dateModified} 
              variant="inline" 
            />
          </div>
        </div>
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
                      <TeamSection team={fund.team} managerName={fund.managerName} initialTeamMembers={initialTeamMembers} />
                    </section>

                    {/* Social Media Section - inherits from company profile with fund override */}
                    <FundSocialMediaSection
                      youtubeUrl={fund.youtubeUrl}
                      instagramUrl={fund.instagramUrl}
                      tiktokUrl={fund.tiktokUrl}
                      facebookUrl={fund.facebookUrl}
                      twitterUrl={fund.twitterUrl}
                      linkedinUrl={fund.linkedinUrl}
                      companySocialMedia={companySocialMedia}
                    />

                    {/* Featured Video Section */}
                    <FundVideoSection videoUrl={fund.youtubeVideoUrl} />

                    {/* News RSS Feed Section */}
                    <FundNewsSection rssFeedUrl={fund.newsRssFeedUrl} />

                    {/* Enquiry Form Section */}
                    <section id="contact-fund" className="scroll-mt-28 md:scroll-mt-24">
                      <FundEnquirySection fund={fund} />
                    </section>
                    
                    {/* PREMIUM CTA DISABLED - Uncomment to re-enable */}
                    {/* <PremiumCTA variant="full" location={`fund-details-${fund.id}`} /> */}
                    
                    {/* Legal and Administrative - Bottom */}
                    <InvestorNotice />
                    
                    {/* Tags Section - Bottom */}
                    <div className="border-t border-border pt-6">
                      <h3 className="text-lg font-semibold mb-4 text-foreground">Fund Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {displayTags.map(tag => (
                          <Button
                            key={tag}
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            asChild
                          >
                            <Link to={`/tags/${tagToSlug(tag)}`}>
                              {tag}
                            </Link>
                          </Button>
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
      
      {/* ROI Calculator - Below Main Content */}
      <div className="mt-8 md:mt-12">
        <ROICalculator fund={fund} />
      </div>
      
      {/* Bottom Sections with Proper Spacing */}
      <div className="space-y-8 md:space-y-12 mt-8 md:mt-12">
        {/* Related Funds Section */}
        <RelatedFunds currentFund={fund} initialFunds={initialFunds} />
        
        {/* Alternative Funds Section */}
        <AlternativeFunds currentFund={fund} initialFunds={initialFunds} />
        
        {/* Fund Comparison Suggestions */}
        <FundComparisonSuggestions currentFund={fund} initialFunds={initialFunds} />
        
        {/* FAQ Section */}
        <FundFAQSection fund={fund} />
      </div>
      
      {/* Floating TOC (Mobile only) */}
      <FloatingTableOfContents fund={fund} />
    </>
  );
};

export default FundDetailsContent;
