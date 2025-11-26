import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PageSEO } from '../components/common/PageSEO';
import { PageLoader } from '../components/common/LoadingSkeleton';
import { useTeamMemberBySlug } from '../hooks/useTeamMemberData';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamMemberCredentials } from '@/components/team/TeamMemberCredentials';
import { managerToSlug } from '@/lib/utils';

const TeamMemberProfile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: teamMemberData, isLoading, error } = useTeamMemberBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  if (error || !teamMemberData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Team Member Not Found</h1>
            <p className="text-muted-foreground">The team member you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
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
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">
                      Funds Managed by {firstName}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teamMemberData.funds.map((fund: any) => (
                        <div
                          key={fund.id}
                          className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                        >
                          <h3 className="font-semibold text-foreground mb-2">
                            {fund.name}
                          </h3>
                          {fund.category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                              {fund.category}
                            </span>
                          )}
                          <Button asChild variant="secondary" size="sm" className="w-full mt-2">
                            <Link to={`/${fund.id}`}>
                              View Fund →
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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
