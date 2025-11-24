import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Fund } from '../../data/types/funds';
import FundListItem from '@/components/FundListItem';
import ManagerVerificationBadge from './ManagerVerificationBadge';
import ManagerAboutSection from './ManagerAboutSection';
import ManagerTeamSection from './ManagerTeamSection';
import ManagerHighlightsSection from './ManagerHighlightsSection';
import ManagerFAQsSection from './ManagerFAQsSection';
import ManagerStatsSection from './ManagerStatsSection';
import ManagerContactSection from './ManagerContactSection';
import ManagerContactForm from './ManagerContactForm';
import { Profile } from '@/types/profile';
import { Badge } from '@/components/ui/badge';

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
  return (
    <div className="space-y-0">
      {/* Manager Header */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-6 mb-6">
            {managerProfile?.logo_url && (
              <img 
                src={managerProfile.logo_url} 
                alt={`${managerName} logo`}
                className="w-24 h-24 rounded-xl object-cover border border-border/40 shadow-sm"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <ManagerVerificationBadge 
                  isVerified={isManagerVerified}
                  funds={managerFunds}
                />
              </div>
              <h1 className="text-5xl font-bold text-foreground mb-4">{managerName}</h1>
            </div>
          </div>
          
          <div className={managerProfile?.logo_url ? "pl-[120px]" : ""}>
            <p className="text-xl text-muted-foreground max-w-3xl mb-4">
              {managerProfile?.description || (
                managerFunds.length === 1 
                  ? "Portugal Golden Visa approved investment fund manager offering professional fund management services for international investors seeking Portuguese residency through capital transfer."
                  : `Portugal Golden Visa approved investment fund manager offering ${managerFunds.length} professional investment funds for international investors seeking Portuguese residency through capital transfer.`
              )}
            </p>
            
            {/* Location & Website badges */}
            {(managerProfile?.city || managerProfile?.country || managerProfile?.website) && (
              <div className="flex flex-wrap gap-3 items-center">
                {(managerProfile?.city || managerProfile?.country) && (
                  <Badge variant="outline" className="text-sm">
                    <MapPin className="h-3 w-3 mr-1.5" />
                    {[managerProfile.city, managerProfile.country].filter(Boolean).join(', ')}
                  </Badge>
                )}
                {managerProfile?.website && (
                  <a 
                    href={managerProfile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Badge variant="outline" className="text-sm hover:bg-primary/10 transition-colors">
                      <ExternalLink className="h-3 w-3 mr-1.5" />
                      Visit Website
                    </Badge>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Overview Stats */}
      {managerProfile && (
        <ManagerStatsSection 
          managerProfile={managerProfile} 
          fundsCount={managerFunds.length}
        />
      )}

      {/* Contact & Regulatory Information */}
      {managerProfile && (
        <ManagerContactSection managerProfile={managerProfile} />
      )}

      {/* Funds List */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-8">Investment Funds</h2>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <ManagerContactForm 
            managerName={managerName}
            companyName={managerProfile?.company_name}
          />
        </div>
      </section>

    </div>
  );
};

export default FundManagerContent;
