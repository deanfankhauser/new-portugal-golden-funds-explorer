import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Fund } from '@/data/types/funds';
import { managerToSlug } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getAllApprovedManagers } from '@/data/services/managers-service';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

interface ManagersCarouselProps {
  funds: Fund[];
}

interface ManagerData {
  name: string;
  slug: string;
  fundCount: number;
  location?: string;
  logoUrl?: string;
}

const ManagersCarousel: React.FC<ManagersCarouselProps> = ({ funds }) => {
  // Fetch manager profiles to get logos
  const { data: managerProfiles } = useQuery({
    queryKey: ['approved-managers-carousel'],
    queryFn: getAllApprovedManagers,
    staleTime: 5 * 60 * 1000,
  });

  // Create a lookup map from profiles by company name
  const profileLookup = new Map(
    (managerProfiles || []).map(p => [
      p.company_name?.toLowerCase().trim(),
      p
    ])
  );

  // Derive manager data from funds
  const managerMap = new Map<string, ManagerData>();
  
  funds.forEach((fund) => {
    if (!fund.managerName) return;
    
    const existing = managerMap.get(fund.managerName);
    if (existing) {
      existing.fundCount += 1;
    } else {
      // Look up the profile to get the logo
      const profile = profileLookup.get(fund.managerName.toLowerCase().trim());
      
      managerMap.set(fund.managerName, {
        name: fund.managerName,
        slug: managerToSlug(fund.managerName),
        fundCount: 1,
        location: fund.location || undefined,
        logoUrl: profile?.logo_url || undefined,
      });
    }
  });

  // Sort by fund count descending, take top 10
  const managers = Array.from(managerMap.values())
    .sort((a, b) => b.fundCount - a.fundCount)
    .slice(0, 10);

  if (managers.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Fund managers
            </h2>
            <p className="text-muted-foreground mt-1">
              Explore managers and the funds they run.
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
            {managers.map((manager) => (
              <CarouselItem key={manager.name} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="bg-card rounded-xl border border-border p-5 h-full flex flex-col hover:border-primary/30 hover:shadow-md transition-all duration-200">
                  {/* Logo */}
                  {manager.logoUrl ? (
                    <img 
                      src={manager.logoUrl} 
                      alt={`${manager.name} logo`}
                      className="w-12 h-12 rounded-lg object-contain bg-muted mb-4"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 ${manager.logoUrl ? 'hidden' : ''}`}>
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>

                  {/* Manager Name */}
                  <h3 className="font-semibold text-foreground text-base mb-1 line-clamp-2">
                    {manager.name}
                  </h3>

                  {/* Location */}
                  {manager.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{manager.location}</span>
                    </div>
                  )}

                  {/* Fund count */}
                  <p className="text-sm text-muted-foreground mb-5 flex-grow">
                    {manager.fundCount} {manager.fundCount === 1 ? 'fund' : 'funds'} listed
                  </p>

                  {/* CTAs */}
                  <div className="flex items-center gap-2 mt-auto">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link to={`/manager/${manager.slug}`}>View manager</Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1">
                      <Link to={`/manager/${manager.slug}#contact`}>Request intro</Link>
                    </Button>
                  </div>
                </div>
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

export default ManagersCarousel;
