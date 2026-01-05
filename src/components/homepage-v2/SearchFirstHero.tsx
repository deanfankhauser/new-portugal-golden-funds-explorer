import React from 'react';
import { Link } from 'react-router-dom';
import QuickFilterBar from './QuickFilterBar';

interface SearchFirstHeroProps {
  onBrowseResults: () => void;
}

const SearchFirstHero: React.FC<SearchFirstHeroProps> = ({ onBrowseResults }) => {
  return (
    <header className="py-10 sm:py-14 lg:py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold mb-3 text-foreground leading-tight">
          Compare Portugal Golden Visa Investment Funds
        </h1>
        
        {/* Subtext */}
        <p className="text-base sm:text-lg text-muted-foreground mb-2 max-w-2xl mx-auto">
          Filter by strategy, fees, risk, and eligibility — then request an introduction to the fund manager. No advice. Just structured facts.
        </p>
        
        {/* Disclosure Link */}
        <p className="text-xs text-muted-foreground/70 mb-8">
          See our <Link to="/disclosure" className="underline hover:text-muted-foreground">Disclosure</Link>
        </p>

        {/* Search Card (includes filters and CTAs) */}
        <QuickFilterBar onBrowseResults={onBrowseResults} />
      </div>
    </header>
  );
};

export default SearchFirstHero;
