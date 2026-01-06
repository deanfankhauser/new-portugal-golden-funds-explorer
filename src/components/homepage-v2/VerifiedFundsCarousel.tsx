import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Fund } from '@/data/types/funds';
import { SaveFundButton } from '@/components/common/SaveFundButton';
import { URL_CONFIG } from '@/utils/urlConfig';
import { useQuery } from '@tanstack/react-query';
import { getAllApprovedManagers } from '@/data/services/managers-service';
import { ManagerLogo } from '@/components/shared/ManagerLogo';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

interface VerifiedFundsCarouselProps {
  funds: Fund[];
}

const formatMinInvestment = (amount: number | null | undefined): string => {
  if (!amount) return '—';
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`;
  if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}K`;
  return `€${amount}`;
};

const getFeeBand = (fee: number | null | undefined): string => {
  if (!fee) return '—';
  if (fee <= 1) return 'Low';
  if (fee <= 2) return 'Medium';
  return 'High';
};

const getLiquidityYears = (term: number | null | undefined): string => {
  if (!term) return '—';
  return `${term} years`;
};

const VerifiedFundsCarousel: React.FC<VerifiedFundsCarouselProps> = ({ funds }) => {
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

  const verifiedFunds = funds
    .filter((f) => f.isVerified)
    .sort((a, b) => (a.finalRank || 999) - (b.finalRank || 999))
    .slice(0, 10);

  if (verifiedFunds.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 border-t border-border/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Verified funds
            </h2>
            <p className="text-muted-foreground mt-1">
              Funds that have completed Movingto verification checks.
            </p>
          </div>
          <Link
            to="/verified-funds"
            className="hidden sm:inline-flex items-center gap-1.5 text-primary font-medium hover:underline"
          >
            View all verified funds
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
            {verifiedFunds.map((fund) => (
              <CarouselItem key={fund.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="bg-card rounded-xl border border-border p-5 h-full flex flex-col shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-200">
                  {/* Verified Badge */}
                  <div className="flex items-center gap-1.5 text-primary mb-3">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Verified</span>
                  </div>

                  {/* Fund Name */}
                  <h3 className="font-semibold text-foreground text-base mb-1 line-clamp-2">
                    {fund.name}
                  </h3>

                  {/* Manager with Logo */}
                  <div className="flex items-center gap-2 mb-4">
                    <ManagerLogo
                      logoUrl={profileLookup.get(fund.managerName?.toLowerCase().trim() || '')?.logo_url}
                      managerName={fund.managerName || 'Unknown'}
                      size="sm"
                      showInitialsFallback={false}
                    />
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {fund.managerName || '—'}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-5 flex-grow">
                    <div>
                      <span className="text-muted-foreground text-xs">Min investment</span>
                      <p className="font-medium text-foreground">{formatMinInvestment(fund.minimumInvestment)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Liquidity</span>
                      <p className="font-medium text-foreground">{getLiquidityYears(fund.term ? Math.round(fund.term / 12) : null)}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground text-xs">Fees</span>
                      <p className="font-medium text-foreground">{getFeeBand(fund.managementFee)}</p>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex items-center gap-2 mt-auto">
                    <Button asChild size="sm" className="flex-1">
                      <Link to={URL_CONFIG.buildFundUrl(fund.id)}>View fund</Link>
                    </Button>
                    <SaveFundButton fundId={fund.id} variant="outline" size="sm" />
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
            to="/verified-funds"
            className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline"
          >
            View all verified funds
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VerifiedFundsCarousel;
