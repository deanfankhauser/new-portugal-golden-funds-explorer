import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TeamMemberAvatar } from '@/components/shared/TeamMemberAvatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  slug: string;
  photo_url: string | null;
  profile_id: string;
  company_name?: string;
  location?: string;
}

const TeamMembersCarousel: React.FC = () => {
  // Fetch team members with their company names
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['homepage-team-members'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_public_team_members', {
        limit_input: 20,
      });

      if (error) {
        console.error('Error fetching team members:', error);
        return [];
      }

      return (data || []).map((member: any) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        slug: member.slug,
        photo_url: member.photo_url,
        profile_id: member.profile_id,
        company_name: member.company_name || undefined,
        location: member.location || undefined,
      })) as TeamMember[];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || !teamMembers || teamMembers.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Fund professionals
            </h2>
            <p className="text-muted-foreground mt-1">
              Meet the people behind the funds.
            </p>
          </div>
          <Link
            to="/managers"
            className="hidden sm:inline-flex items-center gap-1.5 text-primary font-medium hover:underline"
          >
            View all managers
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
          <CarouselContent className="-ml-4">
            {teamMembers.map((member) => (
              <CarouselItem key={member.id} className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <Link
                  to={`/team/${member.slug}`}
                  className="block bg-card rounded-xl border border-border p-5 h-full shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-200 group"
                >
                  {/* Circular Photo */}
                  <div className="flex justify-start mb-4">
                    <TeamMemberAvatar
                      photoUrl={member.photo_url}
                      name={member.name}
                      size="lg"
                      className="ring-2 ring-border group-hover:ring-primary/30 transition-all duration-200"
                    />
                  </div>
                  
                  {/* Name */}
                  <h3 className="font-semibold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  
                  {/* Role */}
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                    {member.role}
                  </p>
                  
                  {/* Location - using company_name as location indicator */}
                  {member.company_name && (
                    <p className="text-sm text-primary mt-3 line-clamp-1">
                      {member.company_name}
                    </p>
                  )}
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-4" />
          <CarouselNext className="hidden sm:flex -right-4" />
        </Carousel>

        {/* Mobile view all link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            to="/managers"
            className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline"
          >
            View all managers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeamMembersCarousel;
