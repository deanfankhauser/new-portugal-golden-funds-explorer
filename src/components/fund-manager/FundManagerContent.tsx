import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Fund } from '../../data/types/funds';
import ManagerSnapshotCard from './ManagerSnapshotCard';
import VerificationStatusBlock from './VerificationStatusBlock';
import ManagerFundCard from './ManagerFundCard';
import ManagerAboutSection from './ManagerAboutSection';
import ManagerTeamSection from './ManagerTeamSection';
import ManagerHighlightsSection from './ManagerHighlightsSection';
import ManagerContactSection from './ManagerContactSection';
import ManagerFAQsSection from './ManagerFAQsSection';
import InvestmentPhilosophySection from './InvestmentPhilosophySection';
import HowMovingtoHelpsSection from './HowMovingtoHelpsSection';
import ManagerRelatedLinks from './ManagerRelatedLinks';
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
  // Get regulator info
  const regulator = (managerProfile?.registration_number || managerProfile?.license_number) 
    ? 'CMVM' 
    : 'the relevant Portuguese authorities';

  const country = managerProfile?.country || 'Portugal';

  return (
    <div className="space-y-0">
      {/* Manager Header */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Left: Logo, H1, Subheading, Website */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6 mb-6">
                {managerProfile?.logo_url && (
                  <img 
                    src={managerProfile.logo_url} 
                    alt={`${managerName} logo`}
                    className="w-24 h-24 rounded-xl object-cover border border-border/40 shadow-sm flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                    {managerName} – Portugal Golden Visa Fund Manager
                  </h1>
                </div>
              </div>
              
              <div className={managerProfile?.logo_url ? "pl-[120px]" : ""}>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {managerName} is a {country}-based asset manager offering funds eligible for the 
                  Portugal Golden Visa, regulated by {regulator} where applicable.
                </p>
                
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
            </div>

            {/* Right: Manager Snapshot Card */}
            <div className="mt-8 lg:mt-0">
              <ManagerSnapshotCard 
                managerProfile={managerProfile}
                isManagerVerified={isManagerVerified}
                fundsCount={managerFunds.length}
                managerFunds={managerFunds}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Verification Status Block */}
      <VerificationStatusBlock 
        isVerified={isManagerVerified}
        managerName={managerName}
      />

      {/* Funds Managed by This Manager */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-foreground mb-3">
            Portugal Golden Visa Funds Managed by {managerName}
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            {managerFunds.length === 1 
              ? 'This manager currently offers 1 fund eligible for the Portugal Golden Visa program.'
              : `This manager currently offers ${managerFunds.length} funds eligible for the Portugal Golden Visa program.`
            }
          </p>
          
          <div className="grid gap-6">
            {managerFunds.map((fund) => (
              <ManagerFundCard key={fund.id} fund={fund} />
            ))}
          </div>
        </div>
      </section>

      {/* About the Manager Section */}
      {managerProfile?.manager_about ? (
        <ManagerAboutSection 
          managerName={managerName}
          about={managerProfile.manager_about}
        />
      ) : (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20 border-y border-border">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              About {managerName}
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground/80 leading-relaxed text-lg">
                {managerProfile?.description || (
                  `${managerName} is an investment manager based in ${country}, offering regulated funds 
                  including options that qualify for the Portugal Golden Visa. Their funds provide international 
                  investors with access to professionally managed portfolios designed to meet Golden Visa 
                  investment requirements while pursuing attractive risk-adjusted returns.`
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Investment Philosophy & Risk Profile */}
      <InvestmentPhilosophySection 
        managerName={managerName}
        managerProfile={managerProfile}
        managerFunds={managerFunds}
      />
      
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

      {/* How Movingto Helps */}
      <HowMovingtoHelpsSection managerName={managerName} />

      {/* Contact & Regulatory Information */}
      {managerProfile && (
        <ManagerContactSection managerProfile={managerProfile} />
      )}
      
      {/* Manager FAQs Section */}
      {managerProfile?.manager_faqs && Array.isArray(managerProfile.manager_faqs) && managerProfile.manager_faqs.length > 0 ? (
        <ManagerFAQsSection 
          managerName={managerName}
          faqs={managerProfile.manager_faqs}
        />
      ) : (
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-foreground mb-8">
              FAQs About {managerName}
            </h2>
            
            <div className="space-y-6">
              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Who is {managerName} and what do they do?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {managerName} is a {country}-based investment manager offering funds eligible for the 
                  Portugal Golden Visa program. They manage professionally structured investment vehicles 
                  that meet CMVM regulatory requirements for Golden Visa eligibility.
                </p>
              </div>

              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Is {managerName} regulated and by whom?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {managerProfile?.registration_number || managerProfile?.license_number
                    ? `Yes, ${managerName} is regulated by CMVM (Comissão do Mercado de Valores Mobiliários), 
                       Portugal's financial regulator. All their Golden Visa eligible funds operate under 
                       CMVM oversight.`
                    : `${managerName} operates funds that meet Portugal Golden Visa requirements. We recommend 
                       verifying specific regulatory status and registration details directly with the manager.`
                  }
                </p>
              </div>

              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Which {managerName} funds are Golden Visa eligible?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  All {managerFunds.length} {managerFunds.length === 1 ? 'fund' : 'funds'} listed on this 
                  page {managerFunds.length === 1 ? 'is' : 'are'} eligible for the Portugal Golden Visa 
                  program. Each fund meets the minimum investment requirements and regulatory standards set 
                  by Portuguese immigration authorities.
                </p>
              </div>

              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Are {managerName} funds suitable for U.S. investors?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  U.S. investors should consult with qualified tax advisors regarding PFIC (Passive Foreign 
                  Investment Company) implications before investing in any non-U.S. fund. Some {managerName} funds 
                  may have specific PFIC considerations that affect U.S. tax treatment.
                </p>
              </div>

              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  How does Movingto work with {managerName}?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Movingto provides independent information and comparison tools to help you evaluate 
                  {managerName} funds alongside other options. We can facilitate introductions to the manager, 
                  coordinate with Portuguese banks, and connect you with qualified immigration lawyers to support 
                  your Golden Visa application.
                </p>
              </div>

              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  What due diligence should I do before investing?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Before investing, thoroughly review fund documentation, understand all fees and liquidity terms, 
                  verify regulatory status, assess your own risk tolerance and investment timeline, and consult 
                  with independent financial and legal advisors. Consider requesting video calls with the fund 
                  management team to discuss strategy and operations.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Links */}
      <ManagerRelatedLinks />
    </div>
  );
};

export default FundManagerContent;
