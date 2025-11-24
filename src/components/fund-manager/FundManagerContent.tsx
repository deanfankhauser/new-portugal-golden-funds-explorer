import React, { useState } from 'react';
import { MapPin, ExternalLink, TrendingUp, Calendar, Building2, Shield } from 'lucide-react';
import { Fund } from '../../data/types/funds';
import FundListItem from '@/components/FundListItem';
import ManagerVerificationBadge from './ManagerVerificationBadge';
import ManagerAboutSection from './ManagerAboutSection';
import ManagerTeamSection from './ManagerTeamSection';
import ManagerHighlightsSection from './ManagerHighlightsSection';
import ManagerFAQsSection from './ManagerFAQsSection';
import ManagerOverviewSection from './ManagerOverviewSection';
import ManagerEnquirySection from './ManagerEnquirySection';

import { Profile } from '@/types/profile';
import { Badge } from '@/components/ui/badge';
import StandardCard from '../common/StandardCard';
import { Button } from '@/components/ui/button';

interface FundManagerContentProps {
  managerFunds: Fund[];
  managerName: string;
  isManagerVerified?: boolean;
  managerProfile?: Profile | null;
}

const FundManagerContent: React.FC<FundManagerContentProps> = ({ 
  managerFunds, 
  managerName, 
  isManagerVerified = false,
  managerProfile
}) => {
  const [isHeroExpanded, setIsHeroExpanded] = useState(false);
  
  const formatAUM = (aum: number): string => {
    // Convert to millions first
    const millions = aum / 1000000;
    
    // If >= 1000 million (1 billion), show in billions
    if (millions >= 1000) {
      const billions = millions / 1000;
      // Remove .0 from whole numbers
      return `€${billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1)}B`;
    }
    
    // Show in millions, remove .0 from whole numbers
    return `€${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  };

  const calculateYearsTrackRecord = (foundedYear?: number): string => {
    if (!foundedYear) return 'N/A';
    return `${new Date().getFullYear() - foundedYear}+`;
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('manager-enquiry-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const fullHeroDescription = managerProfile?.description || 
    `Strategic investment solutions across Portugal's Golden Visa real estate and technology sectors`;
  
  const getTruncatedHeroText = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length <= 2) return text;
    return sentences.slice(0, 2).join('. ') + '.';
  };
  
  const truncatedHeroDescription = getTruncatedHeroText(fullHeroDescription);
  const shouldShowHeroReadMore = fullHeroDescription.length > truncatedHeroDescription.length;

  return (
    <div className="space-y-0">
      {/* Hero Section with Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-start">
            <div>
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

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Active Funds */}
                <StandardCard padding="sm" className="text-center">
                  <div className="text-4xl font-bold text-primary mb-1">
                    {managerFunds.length}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Active Fund{managerFunds.length !== 1 ? 's' : ''}
                  </div>
                </StandardCard>

                {/* AUM */}
                {managerProfile?.assets_under_management && managerProfile.assets_under_management > 0 && (
                  <StandardCard padding="sm" className="text-center">
                    <div className="text-4xl font-bold text-primary mb-1">
                      {formatAUM(managerProfile.assets_under_management)}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      AUM
                    </div>
                  </StandardCard>
                )}

                {/* Location/Regions */}
                {(managerProfile?.city || managerProfile?.country) && (
                  <StandardCard padding="sm" className="text-center">
                    <div className="text-4xl font-bold text-primary mb-1">
                      {[managerProfile.city, managerProfile.country].filter(Boolean).length}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      Region{[managerProfile.city, managerProfile.country].filter(Boolean).length > 1 ? 's' : ''}
                    </div>
                  </StandardCard>
                )}

                {/* Track Record */}
                {managerProfile?.founded_year && (
                  <StandardCard padding="sm" className="text-center">
                    <div className="text-4xl font-bold text-primary mb-1">
                      {calculateYearsTrackRecord(managerProfile.founded_year)}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      Years Track Record
                    </div>
                  </StandardCard>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0">
              <Button 
                onClick={scrollToForm}
                size="lg"
                className="px-8 py-6 text-lg font-semibold whitespace-nowrap"
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section - About + Contact Sidebar */}
      <ManagerOverviewSection 
        managerName={managerName}
        managerProfile={managerProfile}
      />

      {/* Fund Portfolio Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-primary mb-2">Fund Portfolio</h2>
            <p className="text-muted-foreground">
              Explore all investment funds managed by {managerName}
            </p>
          </div>
          <div className="space-y-6">
            {managerFunds.map((fund) => (
              <FundListItem key={fund.id} fund={fund} />
            ))}
          </div>
        </div>
      </section>

      {/* Manager About Section */}
      {managerProfile?.manager_about && (
        <ManagerAboutSection 
          managerName={managerName}
          about={managerProfile.manager_about}
        />
      )}
      
      {/* Manager Highlights Section */}
      {managerProfile?.manager_highlights && Array.isArray(managerProfile.manager_highlights) && managerProfile.manager_highlights.length > 0 && (
        <ManagerHighlightsSection 
          managerName={managerName}
          highlights={managerProfile.manager_highlights}
        />
      )}
      
      {/* Manager Team Section */}
      {managerProfile?.team_members && Array.isArray(managerProfile.team_members) && managerProfile.team_members.length > 0 && (
        <ManagerTeamSection 
          managerName={managerName}
          teamMembers={managerProfile.team_members}
        />
      )}
      
      {/* Manager FAQs Section */}
      {managerProfile?.manager_faqs && Array.isArray(managerProfile.manager_faqs) && managerProfile.manager_faqs.length > 0 && (
        <ManagerFAQsSection 
          managerName={managerName}
          faqs={managerProfile.manager_faqs}
        />
      )}

      {/* Contact Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border bg-background">
        <div className="max-w-3xl mx-auto">
          <ManagerEnquirySection 
            managerName={managerName}
            companyName={managerProfile?.company_name}
          />
        </div>
      </section>

    </div>
  );
};

export default FundManagerContent;
