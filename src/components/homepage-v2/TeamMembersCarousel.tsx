import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { TeamMemberAvatar } from '@/components/shared/TeamMemberAvatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface TeamMemberWithCompany {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  slug: string;
  company_name: string | null;
}

const fetchFeaturedTeamMembers = async (): Promise<TeamMemberWithCompany[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select(`
      id,
      name,
      role,
      photo_url,
      slug,
      profile_id,
      profiles (
        company_name
      )
    `)
    .not('photo_url', 'is', null)
    .limit(20);

  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }

  // Transform data and sort by role priority
  const transformed = (data || []).map((tm: any) => ({
    id: tm.id,
    name: tm.name,
    role: tm.role,
    photo_url: tm.photo_url,
    slug: tm.slug,
    company_name: tm.profiles?.company_name || null,
  }));

  // Sort by role priority (CEOs/Partners first)
  return transformed.sort((a, b) => {
    const getPriority = (role: string) => {
      const r = role.toLowerCase();
      if (r.includes('ceo') || r.includes('managing partner') || r.includes('founder')) return 1;
      if (r.includes('partner') || r.includes('director') || r.includes('cfo') || r.includes('cio')) return 2;
      if (r.includes('manager') || r.includes('head')) return 3;
      return 4;
    };
    return getPriority(a.role) - getPriority(b.role);
  });
};

const TeamMembersCarousel: React.FC = () => {
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['featured-team-members'],
    queryFn: fetchFeaturedTeamMembers,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || !teamMembers || teamMembers.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Fund professionals
            </h2>
            <p className="text-muted-foreground mt-1">
              Meet the people behind Portugal's investment funds
            </p>
          </div>
          <Link
            to="/team"
            className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all professionals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 md:-ml-4">
            {teamMembers.map((member) => (
              <CarouselItem
                key={member.id}
                className="pl-3 md:pl-4 basis-[280px] sm:basis-[300px] md:basis-[320px]"
              >
                <Link
                  to={`/team/${member.slug}`}
                  className="block h-full"
                >
                  <div className="bg-card border border-border rounded-xl p-5 h-full hover:shadow-md hover:border-primary/20 transition-all duration-200">
                    {/* Avatar and Info */}
                    <div className="flex items-start gap-4">
                      <TeamMemberAvatar
                        photoUrl={member.photo_url}
                        name={member.name}
                        size="lg"
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-foreground truncate">
                          {member.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                          {member.role}
                        </p>
                        {member.company_name && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground truncate">
                              {member.company_name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Profile Link */}
                    <div className="mt-4 pt-3 border-t border-border">
                      <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        View profile
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>

        {/* Mobile View All Link */}
        <div className="mt-6 md:hidden">
          <Link
            to="/team"
            className="flex items-center justify-center gap-1 text-sm font-medium text-primary"
          >
            View all professionals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeamMembersCarousel;
