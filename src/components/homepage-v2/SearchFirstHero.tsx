import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import QuickFilterBar from './QuickFilterBar';

interface SearchFirstHeroProps {
  onBrowseResults: () => void;
}

const SearchFirstHero: React.FC<SearchFirstHeroProps> = ({ onBrowseResults }) => {
  return (
    <header className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground leading-tight">
          Compare Portugal Golden Visa funds — clearly.
        </h1>
        
        {/* Subtext */}
        <p className="text-lg sm:text-xl text-muted-foreground mb-2 max-w-2xl mx-auto">
          Browse, filter, and request an intro. No advice. Just structured facts.
        </p>
        
        {/* Compliance Line */}
        <p className="text-sm text-muted-foreground/70 mb-8">
          Information only. Not advice.
        </p>

        {/* Search + Quick Filter Bar */}
        <QuickFilterBar onBrowseResults={onBrowseResults} />

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button 
            size="lg" 
            onClick={onBrowseResults}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
          >
            Browse results
          </Button>
          <Button 
            asChild
            variant="outline" 
            size="lg"
            className="font-semibold px-8 border-border hover:bg-muted"
          >
            <Link to="/compare">Compare funds</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SearchFirstHero;
