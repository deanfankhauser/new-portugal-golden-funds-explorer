import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PageSEO } from '../components/common/PageSEO';
import { PageLoader } from '../components/common/LoadingSkeleton';
import { useTeamMemberBySlug } from '../hooks/useTeamMemberData';
import { FundAffiliationBanner } from '@/components/team/FundAffiliationBanner';
import { TeamMemberHero } from '@/components/team/TeamMemberHero';
import { TeamMemberSnapshot, SnapshotItem } from '@/components/team/TeamMemberSnapshot';
import { ScopeAndBoundaries } from '@/components/team/ScopeAndBoundaries';
import { TeamMemberBio } from '@/components/team/TeamMemberBio';
import { TeamMemberCredentials } from '@/components/team/TeamMemberCredentials';
import { ConnectedFundCard } from '@/components/team/ConnectedFundCard';
import { DirectoryDisclosureFooter } from '@/components/team/DirectoryDisclosureFooter';
import { managerToSlug } from '@/lib/utils';
import { Fund } from '@/data/types/funds';
import { isGoneTeamMember } from '@/lib/gone-slugs';
import GonePage from './GonePage';
import NotFound from './NotFound';
import { trackTeamPageView } from '@/utils/teamRouteTracking';
import { Briefcase, Building2, MapPin, Globe, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TeamMemberProfileProps {
  teamMemberData?: {
    slug: string;
    name: string;
    role: string;
    bio?: string;
    photo_url?: string;
    linkedin_url?: string;
    profiles?: { company_name?: string; manager_name?: string };
    funds?: Fund[];
  };
}

const TeamMemberProfile: React.FC<TeamMemberProfileProps> = ({ teamMemberData: ssrData }) => {
  const { slug } = useParams<{ slug: string }>();
  const effectiveSlug = ssrData?.slug || slug;
  
  // Skip hook if we have SSR data
  const { data: fetchedData, isLoading, error } = useTeamMemberBySlug(
    ssrData ? undefined : effectiveSlug
  );
  
  // Use SSR data if available, otherwise use fetched data
  const teamMemberData = ssrData || fetchedData;

  // Extract data for hooks (must be before any early returns)
  const profile = teamMemberData?.profiles;
  const companyName = profile?.company_name || profile?.manager_name;
  const companySlug = companyName ? managerToSlug(companyName) : undefined;
  const primaryFund = teamMemberData?.funds?.[0];
  const fundName = primaryFund?.name || companyName || 'Fund';
  const fundSlug = primaryFund?.id || '';

  // Build snapshot items from available data (must be before early returns)
  const snapshotItems: SnapshotItem[] = useMemo(() => {
    if (!teamMemberData) return [];
    
    const items: SnapshotItem[] = [];
    
    if (teamMemberData.role) {
      items.push({ label: 'Role', value: teamMemberData.role, icon: Briefcase });
    }
    
    if (companyName) {
      items.push({ label: 'Company', value: companyName, icon: Building2 });
    }
    
    // Use team member's location if available, fallback to fund location
    const location = (teamMemberData as any).location || primaryFund?.location;
    if (location) {
      items.push({ label: 'Location', value: location, icon: MapPin });
    }
    
    // Languages from team member data
    const languages = (teamMemberData as any).languages;
    if (languages?.length) {
      items.push({ label: 'Languages', value: languages.join(', '), icon: Globe });
    }
    
    // Team since date
    const teamSince = (teamMemberData as any).team_since;
    if (teamSince) {
      try {
        items.push({ label: 'Team Since', value: format(new Date(teamSince), 'MMM yyyy'), icon: Calendar });
      } catch {
        items.push({ label: 'Team Since', value: teamSince, icon: Calendar });
      }
    }
    
    if (primaryFund?.category) {
      items.push({ label: 'Fund Type', value: primaryFund.category });
    }
    
    return items;
  }, [teamMemberData, companyName, primaryFund]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Track team page views for analytics
  useEffect(() => {
    if (effectiveSlug && !ssrData) {
      trackTeamPageView(effectiveSlug, !!teamMemberData);
    }
  }, [effectiveSlug, teamMemberData, ssrData]);

  // Check if this is a known removed slug - return 410 Gone
  if (effectiveSlug && isGoneTeamMember(effectiveSlug)) {
    return <GonePage slug={effectiveSlug} type="team-member" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-8">
          <PageLoader />
        </main>
        <Footer />
      </div>
    );
  }

  // Return proper 404 NotFound for non-existent team members
  if (error || !teamMemberData) {
    return <NotFound />;
  }

  // Contact info - use fund manager company info if available
  const contactEmail = undefined;
  const contactUrl = undefined;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO 
        pageType="team-member" 
        memberName={teamMemberData.name}
        memberRole={teamMemberData.role}
        managerName={companyName || undefined}
        linkedinUrl={teamMemberData.linkedin_url || undefined}
        memberSlug={slug}
      />
      
      <Header />
      
      {/* Fund Affiliation Banner */}
      {fundSlug && (
        <FundAffiliationBanner 
          fundName={fundName} 
          fundSlug={fundSlug} 
        />
      )}
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Hero Section */}
          <TeamMemberHero
            name={teamMemberData.name}
            role={teamMemberData.role}
            photoUrl={teamMemberData.photo_url}
            fundName={fundName}
            fundSlug={fundSlug}
            contactUrl={contactUrl}
            contactEmail={contactEmail}
            linkedinUrl={teamMemberData.linkedin_url}
          />

          {/* Two-Column Layout for Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Column (2/3) */}
            <div className="lg:col-span-2 space-y-2">
              {/* Snapshot */}
              {snapshotItems.length > 0 && (
                <TeamMemberSnapshot items={snapshotItems} />
              )}

              {/* Scope & Boundaries */}
              <ScopeAndBoundaries />

              {/* Bio Section */}
              <TeamMemberBio bio={teamMemberData.bio} />

              {/* Connected Fund Card */}
              {primaryFund && (
                <ConnectedFundCard fund={primaryFund} />
              )}

              {/* Directory Disclosure */}
              <DirectoryDisclosureFooter />
            </div>

            {/* Credentials Sidebar - Right Column (1/3) */}
            <div className="lg:col-span-1">
              <TeamMemberCredentials
                role={teamMemberData.role}
                companyName={companyName || 'Fund Manager'}
                companySlug={companySlug}
                linkedinUrl={teamMemberData.linkedin_url || undefined}
                bio={teamMemberData.bio || undefined}
                education={(teamMemberData as any).education || undefined}
                certifications={(teamMemberData as any).certifications || undefined}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeamMemberProfile;
