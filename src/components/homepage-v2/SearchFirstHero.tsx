import React from 'react';
import { Link } from 'react-router-dom';
import QuickFilterBar from './QuickFilterBar';

const SearchFirstHero: React.FC = () => {
  return (
    <header className="py-10 sm:py-14 lg:py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold mb-3 text-foreground leading-tight">
          Compare Portugal Golden Visa Investment Funds
        </h1>
        
        {/* Subtext */}
        <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Filter by strategy, fees, risk, and eligibility — then request an introduction to the fund manager. No advice. Just structured facts.
        </p>
        

        {/* Search Card (includes filters and CTAs) */}
        <QuickFilterBar />
      </div>
    </header>
  );
};

export default SearchFirstHero;
