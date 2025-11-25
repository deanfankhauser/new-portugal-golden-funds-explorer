import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PageSEO } from '../components/common/PageSEO';
import { PageLoader } from '../components/common/LoadingSkeleton';
import { useTeamMemberBySlug } from '../hooks/useTeamMemberData';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Linkedin, ExternalLink } from 'lucide-react';
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
        pageType="fund" 
        fundName={`${teamMemberData.name} - Team Profile`}
      />
      
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <Avatar className="h-32 w-32 mx-auto mb-6 border-4 border-primary/10 ring-8 ring-primary/5">
              <AvatarImage src={teamMemberData.photo_url || undefined} alt={teamMemberData.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-3xl">
                {getInitials(teamMemberData.name)}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-4xl font-bold text-foreground mb-3">
              {teamMemberData.name}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {teamMemberData.role}
            </p>

            {companyName && (
              <Link 
                to={`/manager/${managerToSlug(companyName)}`}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Building2 className="h-4 w-4" />
                <span className="font-medium">{companyName}</span>
              </Link>
            )}

            {teamMemberData.linkedin_url && (
              <div className="mt-4">
                <a
                  href={teamMemberData.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  View LinkedIn Profile
                </a>
              </div>
            )}
          </div>

          {/* Bio Section */}
          {teamMemberData.bio && (
            <Card className="mb-12">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-foreground mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {teamMemberData.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Funds Managed Section */}
          {teamMemberData.funds && teamMemberData.funds.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Funds Managed
              </h2>
              
              <div className="grid gap-6">
                {teamMemberData.funds.map((fund: any) => (
                  <Card key={fund.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Link 
                            to={`/${fund.id}`}
                            className="text-xl font-semibold text-foreground hover:text-primary transition-colors mb-2 block"
                          >
                            {fund.name}
                          </Link>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {fund.category && (
                              <Badge variant="secondary">{fund.category}</Badge>
                            )}
                            {fund.fund_role && (
                              <Badge variant="outline">{fund.fund_role}</Badge>
                            )}
                          </div>
                          
                          {fund.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {fund.description}
                            </p>
                          )}
                        </div>
                        
                        <Link
                          to={`/${fund.id}`}
                          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors shrink-0"
                        >
                          View Fund
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeamMemberProfile;
