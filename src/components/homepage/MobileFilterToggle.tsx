
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter, Sparkles } from 'lucide-react';

interface MobileFilterToggleProps {
  showMobileFilter: boolean;
  setShowMobileFilter: (show: boolean) => void;
  activeFiltersCount?: number;
  hasSearch?: boolean;
}

const MobileFilterToggle: React.FC<MobileFilterToggleProps> = ({
  showMobileFilter,
  setShowMobileFilter,
  activeFiltersCount = 0,
  hasSearch = false
}) => {
  const totalActiveFilters = activeFiltersCount + (hasSearch ? 1 : 0);

  return (
    <div className="lg:hidden mb-6 space-y-3">
      {/* Main Filter Toggle */}
      <Button
        onClick={() => setShowMobileFilter(!showMobileFilter)}
        variant="outline"
        className={`w-full justify-between gap-3 h-16 text-base font-medium rounded-2xl 
                   border-2 transition-all duration-300 ${
          showMobileFilter 
            ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
            : 'bg-card border-border hover:bg-secondary/50 hover:border-border'
        }`}
        aria-expanded={showMobileFilter}
        aria-controls="mobile-filter-section"
        aria-label={showMobileFilter ? "Hide search and filters" : "Show search and filters"}
      >
        <div className="flex items-center gap-3">
          {showMobileFilter ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <div className="relative">
              <Filter className="h-6 w-6" aria-hidden="true" />
              {totalActiveFilters > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {totalActiveFilters}
                </Badge>
              )}
            </div>
          )}
          <div className="text-left">
            <div className="font-semibold">
              {showMobileFilter ? 'Hide Filters' : 'Search & Filter'}
            </div>
            {!showMobileFilter && totalActiveFilters > 0 && (
              <div className="text-sm opacity-75">
                {totalActiveFilters} active filter{totalActiveFilters !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
        
        {!showMobileFilter && totalActiveFilters === 0 && (
          <div className="flex items-center gap-1 text-sm opacity-75">
            <Sparkles className="h-4 w-4" />
            <span>Tap to filter</span>
          </div>
        )}
      </Button>

      {/* Quick Access Buttons when filters are hidden */}
      {!showMobileFilter && totalActiveFilters > 0 && (
        <div className="flex gap-2 px-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileFilter(true)}
            className="flex-1 h-10 text-sm text-muted-foreground hover:text-foreground 
                     hover:bg-secondary rounded-xl border border-border"
          >
            <Search className="h-4 w-4 mr-2" />
            Edit Filters
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-3 text-sm text-destructive hover:text-destructive 
                     hover:bg-destructive/10 rounded-xl border border-destructive/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileFilterToggle;
