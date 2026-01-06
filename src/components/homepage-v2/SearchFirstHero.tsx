import React from 'react';
import QuickFilterBar from './QuickFilterBar';
import DataFreshnessBadge from '@/components/common/DataFreshnessBadge';

const SearchFirstHero: React.FC = () => {
  return (
    <header className="py-10 sm:py-14 lg:py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        {/* Data Freshness Badge */}
        <div className="flex justify-center mb-4">
          <DataFreshnessBadge variant="page-level" />
        </div>
        
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold mb-3 text-foreground leading-tight">
          Portugal Golden Visa Investment Funds
        </h1>
        
        {/* Subtext */}
        <h2 className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-normal">
          Compare Portugal Golden Visa investment funds by strategy, fees, risk, and eligibility — then request an introduction to the fund manager.
        </h2>
        

        {/* Search Card (includes filters and CTAs) */}
        <QuickFilterBar />
      </div>
    </header>
  );
};

export default SearchFirstHero;
