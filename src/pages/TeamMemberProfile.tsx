import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PageSEO } from '../components/common/PageSEO';
import { PageLoader } from '../components/common/LoadingSkeleton';
import { useTeamMemberBySlug } from '../hooks/useTeamMemberData';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { TeamMemberCredentials } from '@/components/team/TeamMemberCredentials';
import FundListItem from '@/components/FundListItem';
import { managerToSlug } from '@/lib/utils';
import { Fund } from '@/data/types/funds';
import { isGoneTeamMember } from '@/lib/gone-slugs';
import GonePage from './GonePage';
import NotFound from './NotFound';
import { trackTeamPageView } from '@/utils/teamRouteTracking';

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

  const { profiles: profile } = teamMemberData;
  const companyName = profile?.company_name || profile?.manager_name;
  const companySlug = companyName ? managerToSlug(companyName) : undefined;
  const firstName = teamMemberData.name.split(' ')[0];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Column (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Section */}
              <div className="flex items-start gap-6">
                <Avatar className="h-32 w-32 border-4 border-primary/10 ring-8 ring-primary/5 shrink-0">
                  <AvatarImage src={teamMemberData.photo_url || undefined} alt={teamMemberData.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-3xl">
                    {getInitials(teamMemberData.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-foreground mb-3">
                    {teamMemberData.name}
                  </h1>
                  
                  <p className="text-xl text-muted-foreground">
                    {teamMemberData.role}
                  </p>
                </div>
              </div>

              {/* Bio Section */}
              {teamMemberData.bio && (
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-4">About</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {teamMemberData.bio}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Managed Funds Section */}
              {teamMemberData.funds && teamMemberData.funds.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Funds Managed by {firstName}
                  </h2>
                  
                  <div className="space-y-4">
                    {teamMemberData.funds.map((fund: Fund) => (
                      <FundListItem key={fund.id} fund={fund} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Credentials Sidebar - Right Column (1/3) */}
            <div className="lg:col-span-1">
              <TeamMemberCredentials
                role={teamMemberData.role}
                companyName={companyName || 'Fund Manager'}
                companySlug={companySlug}
                linkedinUrl={teamMemberData.linkedin_url || undefined}
                bio={teamMemberData.bio || undefined}
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
