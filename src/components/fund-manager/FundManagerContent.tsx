
import React from 'react';
import { Info, HelpCircle } from 'lucide-react';
import { Fund } from '../../data/funds';
import FundListItem from '@/components/FundListItem';
import FundManagerAbout from './FundManagerAbout';
import FundManagerFAQs from './FundManagerFAQs';
import ManagerVerificationBadge from './ManagerVerificationBadge';
import ManagerAboutSection from './ManagerAboutSection';
import ManagerTeamSection from './ManagerTeamSection';
import ManagerHighlightsSection from './ManagerHighlightsSection';
import ManagerFAQsSection from './ManagerFAQsSection';
import { Profile } from '@/types/profile';

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
      <div className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-6 mb-6">
            {managerProfile?.logo_url && (
              <img 
                src={managerProfile.logo_url} 
                alt={`${managerName} logo`}
                className="w-24 h-24 rounded-xl object-cover border border-border/40"
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
            <p className="text-xl text-muted-foreground max-w-3xl">
              {managerFunds.length === 1 
                ? "Portugal Golden Visa approved investment fund manager offering professional fund management services for international investors seeking Portuguese residency through capital transfer."
                : `Portugal Golden Visa approved investment fund manager offering ${managerFunds.length} professional investment funds for international investors seeking Portuguese residency through capital transfer.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Funds List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-foreground mb-8">Funds</h2>
          <div className="space-y-6">
            {managerFunds.map((fund) => (
              <FundListItem key={fund.id} fund={fund} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Manager About Section - Only show if manager profile exists and has content */}
      {isManagerVerified && managerProfile?.manager_about && (
        <ManagerAboutSection 
          managerName={managerName}
          about={managerProfile.manager_about}
        />
      )}
      
      {/* Manager Highlights Section - Only show if manager profile exists and has highlights */}
      {isManagerVerified && managerProfile?.manager_highlights && Array.isArray(managerProfile.manager_highlights) && managerProfile.manager_highlights.length > 0 && (
        <ManagerHighlightsSection 
          managerName={managerName}
          highlights={managerProfile.manager_highlights}
        />
      )}
      
      {/* Manager Team Section - Only show if manager profile exists and has team members */}
      {isManagerVerified && managerProfile?.team_members && Array.isArray(managerProfile.team_members) && managerProfile.team_members.length > 0 && (
        <ManagerTeamSection 
          managerName={managerName}
          teamMembers={managerProfile.team_members}
        />
      )}
      
      {/* Manager FAQs Section - Only show if manager profile exists and has FAQs */}
      {isManagerVerified && managerProfile?.manager_faqs && Array.isArray(managerProfile.manager_faqs) && managerProfile.manager_faqs.length > 0 && (
        <ManagerFAQsSection 
          managerName={managerName}
          faqs={managerProfile.manager_faqs}
        />
      )}

      {/* About Our Funds */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-3xl font-semibold text-foreground">About Our Funds</h2>
          {managerFunds.map((fund) => (
            <FundManagerAbout key={`about-${fund.id}`} fund={fund} />
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="text-3xl font-semibold text-foreground">Frequently Asked Questions</h2>
          {managerFunds.map((fund) => (
            <FundManagerFAQs key={`faq-${fund.id}`} fund={fund} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default FundManagerContent;
