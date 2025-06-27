
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

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
    <div className="lg:hidden mb-8 space-y-4">
      {/* Enhanced Main Filter Toggle */}
      <Button
        onClick={() => setShowMobileFilter(!showMobileFilter)}
        variant="outline"
        className={`w-full justify-between gap-4 h-18 text-base font-semibold rounded-2xl 
                   border-2 transition-all duration-300 shadow-sm hover:shadow-lg ${
          showMobileFilter 
            ? 'bg-gradient-to-r from-primary to-primary/90 text-white border-primary shadow-lg hover:shadow-xl' 
            : 'bg-gradient-to-r from-white to-gray-50 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800'
        }`}
        aria-expanded={showMobileFilter}
        aria-controls="mobile-filter-section"
        aria-label={showMobileFilter ? "Hide search and filters" : "Show search and filters"}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            {showMobileFilter ? (
              <ChevronUp className="h-6 w-6" aria-hidden="true" />
            ) : (
              <div className="relative">
                <Filter className="h-6 w-6" aria-hidden="true" />
                {totalActiveFilters > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-3 -right-3 h-6 w-6 p-0 flex items-center justify-center text-xs
                               bg-gradient-to-r from-red-500 to-red-600 shadow-lg animate-pulse"
                  >
                    {totalActiveFilters}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="text-left">
            <div className="font-bold text-lg">
              {showMobileFilter ? 'Hide Filters' : 'Search & Filter Funds'}
            </div>
            {!showMobileFilter && totalActiveFilters > 0 && (
              <div className={`text-sm ${showMobileFilter ? 'opacity-90' : 'opacity-75'}`}>
                {totalActiveFilters} active filter{totalActiveFilters !== 1 ? 's' : ''}
              </div>
            )}
            {!showMobileFilter && totalActiveFilters === 0 && (
              <div className="text-sm opacity-75">
                Find your perfect fund
              </div>
            )}
          </div>
        </div>
        
        {!showMobileFilter && totalActiveFilters === 0 && (
          <div className="flex items-center gap-2 text-sm opacity-75 bg-white/20 px-3 py-1.5 rounded-full">
            <Sparkles className="h-4 w-4" />
            <span>Tap to explore</span>
          </div>
        )}

        {!showMobileFilter && totalActiveFilters > 0 && (
          <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1.5 rounded-full">
            <span>View Results</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        )}
      </Button>

      {/* Enhanced Quick Access Buttons when filters are hidden */}
      {!showMobileFilter && totalActiveFilters > 0 && (
        <div className="flex gap-3 px-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileFilter(true)}
            className="flex-1 h-12 text-sm text-gray-600 hover:text-gray-800 
                     hover:bg-gray-100 rounded-xl border border-gray-200
                     bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Search className="h-4 w-4 mr-2" />
            Edit Filters
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-12 px-4 text-sm text-red-600 hover:text-red-700 
                     hover:bg-red-50 rounded-xl border border-red-200
                     bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileFilterToggle;
