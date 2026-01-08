import React, { useState } from 'react';
import { MapPin, ExternalLink, TrendingUp, Calendar, Building2, Shield } from 'lucide-react';
import { Fund } from '../../data/types/funds';
import FundListItem from '@/components/FundListItem';
import ManagerVerificationBadge from './ManagerVerificationBadge';
import ManagerAboutSection from './ManagerAboutSection';
import ManagerTeamSection from './ManagerTeamSection';
import ManagerHighlightsSection from './ManagerHighlightsSection';
import ManagerFAQsSection from './ManagerFAQsSection';
import ManagerContactSection from './ManagerContactSection';
import ManagerEnquirySection from './ManagerEnquirySection';
import ManagerSummaryCard from './ManagerSummaryCard';

import { Profile } from '@/types/profile';
import { Badge } from '@/components/ui/badge';
import StandardCard from '../common/StandardCard';
import { Button } from '@/components/ui/button';
import { formatAUM } from '@/utils/currencyFormatters';

interface SSRTeamMember {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  linkedin_url?: string;
  company_name?: string;
}

interface FundManagerContentProps {
  managerFunds: Fund[];
  managerName: string;
  isManagerVerified?: boolean;
  managerProfile?: Profile | null;
  initialTeamMembers?: SSRTeamMember[];
}

const FundManagerContent: React.FC<FundManagerContentProps> = ({ 
  managerFunds, 
  managerName, 
  isManagerVerified = false,
  managerProfile,
  initialTeamMembers
}) => {
  const [isHeroExpanded, setIsHeroExpanded] = useState(false);

  const calculateYearsTrackRecord = (foundedYear?: number): string => {
    if (!foundedYear) return 'N/A';
    return `${new Date().getFullYear() - foundedYear}+`;
  };

  // Calculate Primary Strategy based on fund distribution
  const calculatePrimaryStrategy = (funds: Fund[]): string => {
    if (funds.length === 0) return 'Multi-Strategy Manager';
    
    const categoryCount: Record<string, number> = {};
    funds.forEach(fund => {
      const cat = fund.category || 'Other';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    const totalFunds = funds.length;
    const sortedCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a);
    
    const [topCategory, topCount] = sortedCategories[0];
    
    // If >50% in one category, they're a specialist
    if (topCount / totalFunds > 0.5) {
      return `${topCategory} Specialist`;
    }
    
    return 'Multi-Strategy Manager';
  };

  // Get regulatory status from entity type or default
  const getRegulatoryStatus = (profile?: Profile | null): string => {
    // Use entity_type if available (new column)
    if (profile?.entity_type) {
      return `${profile.entity_type} Regulated Entity`;
    }
    // Fallback: check license/registration
    if (profile?.license_number || profile?.registration_number) {
      return 'CMVM Regulated Entity';
    }
    return 'Investment Manager';
  };

  // Enhance short bios with dynamic boilerplate (Corporate Bio Template)
  const getEnhancedDescription = (
    description: string | undefined,
    managerName: string,
    fundCount: number,
    isVerified: boolean,
    primaryStrategy: string
  ): string => {
    const baseDesc = description || '';
    
    // If description is short (<100 chars), append dynamic boilerplate
    if (baseDesc.length < 100) {
      const verifiedText = isVerified ? 'verified ' : '';
      // Remove " Specialist" or " Manager" from strategy for cleaner text
      const strategyText = primaryStrategy
        .replace(' Specialist', '')
        .replace(' Manager', '');
      
      const boilerplate = `${managerName} is a ${verifiedText}investment management entity operating in Portugal. They currently manage ${fundCount} active investment fund${fundCount !== 1 ? 's' : ''} listed on our platform, specializing in ${strategyText} strategies. The firm is subject to CMVM regulatory oversight.`;
      
      return baseDesc ? `${baseDesc} ${boilerplate}` : boilerplate;
    }
    
    return baseDesc;
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('manager-enquiry-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Group funds by status for "Fund Shelf"
  const openFunds = managerFunds.filter(f => 
    f.fundStatus === 'Open' || f.fundStatus === 'Closing Soon'
  );
  const trackRecordFunds = managerFunds.filter(f => 
    f.fundStatus === 'Closed' || f.fundStatus === 'Liquidated'
  );

  const primaryStrategy = calculatePrimaryStrategy(managerFunds);
  const regulatoryStatus = getRegulatoryStatus(managerProfile);
  
  // Use enhanced description with auto-generated boilerplate if needed
  const fullHeroDescription = getEnhancedDescription(
    managerProfile?.description,
    managerName,
    managerFunds.length,
    isManagerVerified,
    primaryStrategy
  );
  
  const getTruncatedHeroText = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length <= 2) return text;
    return sentences.slice(0, 2).join('. ') + '.';
  };
  
  const truncatedHeroDescription = getTruncatedHeroText(fullHeroDescription);
  const shouldShowHeroReadMore = fullHeroDescription.length > truncatedHeroDescription.length;

  return (
    <div className="space-y-0">
      {/* Main Container with Two-Column Layout */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-start">
            {/* Left Column - All Content */}
            <div className="space-y-0">
              {/* Hero Section */}
              <div className="mb-12">
                {/* Verification Badge */}
                <div className="mb-4">
                  <ManagerVerificationBadge 
                    isVerified={isManagerVerified}
                    funds={managerFunds}
                  />
                </div>

                {/* Title */}
                <h1 className="text-5xl font-bold text-primary mb-4 tracking-tight">
                  {managerName}
                </h1>

                {/* Tagline */}
                <div className="max-w-3xl mb-8">
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {isHeroExpanded ? fullHeroDescription : truncatedHeroDescription}
                  </p>
                  {shouldShowHeroReadMore && (
                    <Button
                      variant="link"
                      onClick={() => setIsHeroExpanded(!isHeroExpanded)}
                      className="px-0 h-auto font-normal text-primary hover:text-primary/80 mt-2"
                    >
                      {isHeroExpanded ? 'Read less' : 'Read more'}
                    </Button>
                  )}
                </div>

                {/* Dynamic Header Stats - Corporate Dossier Style */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Funds */}
                  <StandardCard padding="sm" className="text-center">
                    <div className="text-xl font-semibold text-primary mb-1">
                      {managerFunds.length}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      Total Fund{managerFunds.length !== 1 ? 's' : ''}
                    </div>
                  </StandardCard>

                  {/* Primary Strategy */}
                  <StandardCard padding="sm" className="text-center">
                    <div className="text-base font-semibold text-primary mb-1 leading-tight">
                      {primaryStrategy}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      Primary Strategy
                    </div>
                  </StandardCard>

                  {/* Regulatory Status */}
                  <StandardCard padding="sm" className="text-center">
                    <div className="text-base font-semibold text-primary mb-1 leading-tight">
                      {regulatoryStatus}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      Regulatory Status
                    </div>
                  </StandardCard>
                </div>
              </div>

              {/* Manager About Section */}
              {managerProfile?.manager_about && (
                <div className="border-t border-border pt-16 pb-16">
                  <ManagerAboutSection 
                    managerName={managerName}
                    about={managerProfile.manager_about}
                  />
                </div>
              )}

              {/* Fund Shelf - Open Opportunities */}
              {openFunds.length > 0 && (
                <div className="border-t border-border pt-20 pb-20">
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-primary mb-2">Open Opportunities</h2>
                    <p className="text-muted-foreground">
                      Currently accepting new investments
                    </p>
                  </div>
                  <div className="space-y-6">
                    {openFunds.map((fund) => (
                      <FundListItem key={fund.id} fund={fund} />
                    ))}
                  </div>
                </div>
              )}

              {/* Fund Shelf - Track Record / Closed */}
              {trackRecordFunds.length > 0 && (
                <div className="border-t border-border pt-20 pb-20">
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-primary mb-2">Track Record / Closed</h2>
                    <p className="text-muted-foreground">
                      Historical funds demonstrating proven execution experience
                    </p>
                  </div>
                  <div className="space-y-6">
                    {trackRecordFunds.map((fund) => (
                      <FundListItem key={fund.id} fund={fund} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Manager Highlights Section */}
              {managerProfile?.manager_highlights && Array.isArray(managerProfile.manager_highlights) && managerProfile.manager_highlights.length > 0 && (
                <div className="border-t border-border pt-16 pb-16">
                  <ManagerHighlightsSection 
                    managerName={managerName}
                    highlights={managerProfile.manager_highlights}
                  />
                </div>
              )}
              
              {/* Manager Team Section */}
              <ManagerTeamSection 
                managerName={managerName}
                teamMembers={managerProfile?.team_members || []}
                initialTeamMembers={initialTeamMembers}
              />
              
              {/* Manager FAQs Section */}
              {managerProfile?.manager_faqs && Array.isArray(managerProfile.manager_faqs) && managerProfile.manager_faqs.length > 0 && (
                <div className="border-t border-border pt-16 pb-16">
                  <ManagerFAQsSection 
                    managerName={managerName}
                    faqs={managerProfile.manager_faqs}
                  />
                </div>
              )}
              
              {/* Manager Contact & Social Media Section */}
              {managerProfile && (
                <ManagerContactSection managerProfile={managerProfile} />
              )}

              {/* Contact Form Section */}
              <div className="border-t border-border pt-20 pb-20">
                <div className="max-w-3xl">
                  <ManagerEnquirySection 
                    managerName={managerName}
                    companyName={managerProfile?.company_name}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Sticky Summary Card */}
            <div className="hidden lg:block flex-shrink-0 sticky top-24">
              <ManagerSummaryCard
                managerName={managerName}
                managerProfile={managerProfile}
                isVerified={isManagerVerified}
                fundCount={managerFunds.length}
                onScheduleClick={scrollToForm}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundManagerContent;
