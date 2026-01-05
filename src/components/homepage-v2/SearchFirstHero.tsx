import React from 'react';
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
          Compare Portugal Golden Visa funds — clearly.
        </h1>
        
        {/* Subtext */}
        <p className="text-base sm:text-lg text-muted-foreground mb-2 max-w-xl mx-auto">
          Browse, filter, and request an intro. No advice. Just structured facts.
        </p>
        
        {/* Compliance Line */}
        <p className="text-xs text-muted-foreground/60 mb-8">
          Information only. Not advice.
        </p>

        {/* Search Card (includes filters and CTAs) */}
        <QuickFilterBar onBrowseResults={onBrowseResults} />
      </div>
    </header>
  );
};

export default SearchFirstHero;
