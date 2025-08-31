
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Search, Lightbulb, ArrowRight, Filter, Sparkles, X } from 'lucide-react';
import { FundTag } from '../../data/funds';

interface EmptyFundsStateProps {
  setSelectedTags: (tags: FundTag[]) => void;
  setSearchQuery: (query: string) => void;
  hasActiveFilters?: boolean;
  searchQuery?: string;
}

const EmptyFundsState: React.FC<EmptyFundsStateProps> = ({
  setSelectedTags,
  setSearchQuery,
  hasActiveFilters = false,
  searchQuery = ''
}) => {
  const popularSuggestions = [
    { label: 'Real Estate Funds', tag: 'Real Estate' as FundTag },
    { label: 'Low Risk Options', tag: 'Low Risk' as FundTag },
    { label: 'Fund minimums', tag: 'Fund subscription minimums' as FundTag },
    { label: 'Currently Open', tag: 'Open' as FundTag },
  ];

  const handleSuggestionClick = (tag: FundTag) => {
    setSelectedTags([]);
    setSearchQuery('');
    setTimeout(() => {
      setSelectedTags([tag]);
    }, 100);
  };

  const handleClearAll = () => {
    setSelectedTags([]);
    setSearchQuery('');
  };

  return (
    <div className="text-center py-16 bg-gradient-to-br from-card to-muted rounded-2xl 
                   shadow-sm border border-border card-hover-effect">
      <div className="max-w-lg mx-auto space-y-8 px-6">
        {/* Icon and Main Message */}
        <div className="space-y-4">
          <div className="relative mx-auto">
            <div className="bg-gradient-to-br from-secondary to-muted w-24 h-24 rounded-full 
                           flex items-center justify-center mx-auto interactive-hover-subtle">
              <Search className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="absolute -top-2 -right-2 bg-primary/10 p-2 rounded-full">
              <Filter className="h-5 w-5 text-primary" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-3 text-high-contrast">
              {hasActiveFilters ? 'No funds match your criteria' : 'Ready to find your perfect fund?'}
            </h3>
            <p className="text-medium-contrast text-lg leading-relaxed">
              {hasActiveFilters 
                ? 'Try adjusting your filters or explore our recommendations below'
                : 'Use our smart filters or get personalized recommendations'
              }
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link to="/fund-quiz">
            <Button className="w-full btn-primary-enhanced text-base h-14 font-semibold text-lg
                             bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary
                             shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    aria-label="Take quiz for fund recommendations">
              <div className="flex items-center gap-3">
                 <div className="p-1 bg-primary-foreground/20 rounded-lg">
                   <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
                 </div>
                <div className="text-left">
                  <div className="font-bold">Get Personalized Recommendations</div>
                  <div className="text-sm opacity-90">3-minute smart quiz</div>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 ml-auto" />
            </Button>
          </Link>
          
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              className="w-full text-base h-12 font-medium btn-secondary-enhanced border-2"
              onClick={handleClearAll}
            >
              <X className="mr-2 h-5 w-5" />
              Clear All Filters & Start Over
            </Button>
          )}
        </div>

        {/* Smart Suggestions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 justify-center">
            <div className="h-px bg-border flex-1"></div>
            <div className="flex items-center gap-2 px-3">
              <Lightbulb className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium text-muted-foreground">
                {hasActiveFilters ? 'Try these instead' : 'Popular searches'}
              </span>
            </div>
            <div className="h-px bg-border flex-1"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {popularSuggestions.map((suggestion, index) => (
              <Button
                key={suggestion.label}
                variant="ghost"
                onClick={() => handleSuggestionClick(suggestion.tag)}
                className="h-auto p-4 text-left border-2 border-dashed border-border 
                         hover:border-primary hover:bg-primary/5 rounded-xl transition-all duration-300
                         hover:scale-105 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                      {suggestion.label}
                    </div>
                    <div className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors duration-300">
                      Tap to explore
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Additional Help */}
        <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-foreground mb-2">Need help choosing?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Our fund experts can guide you through the selection process based on your specific goals and requirements.
              </p>
              <Link to="/about">
                <Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-primary/10">
                  Learn more about our process
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyFundsState;
