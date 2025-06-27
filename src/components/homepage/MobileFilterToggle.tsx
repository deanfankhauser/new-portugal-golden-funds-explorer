
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter, Sparkles, ChevronDown } from 'lucide-react';

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
        className={`w-full justify-between gap-4 h-20 text-lg font-bold rounded-3xl 
                   border-2 transition-all duration-500 shadow-lg hover:shadow-xl ${
          showMobileFilter 
            ? 'bg-gradient-to-r from-primary to-primary/90 text-white border-primary shadow-2xl scale-[1.02]' 
            : 'bg-gradient-to-r from-white to-gray-50/50 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:scale-[1.02]'
        }`}
        aria-expanded={showMobileFilter}
        aria-controls="mobile-filter-section"
        aria-label={showMobileFilter ? "Hide search and filters" : "Show search and filters"}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            {showMobileFilter ? (
              <X className="h-7 w-7" aria-hidden="true" />
            ) : (
              <>
                <Filter className="h-7 w-7" aria-hidden="true" />
                {totalActiveFilters > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-3 -right-3 h-6 w-6 p-0 flex items-center justify-center 
                             text-xs font-bold animate-pulse shadow-lg"
                  >
                    {totalActiveFilters}
                  </Badge>
                )}
              </>
            )}
          </div>
          <div className="text-left">
            <div className="text-xl font-black">
              {showMobileFilter ? 'Hide Filters' : 'Search & Filter'}
            </div>
            {!showMobileFilter && totalActiveFilters > 0 && (
              <div className={`text-sm font-semibold ${showMobileFilter ? 'text-white/80' : 'text-gray-600'}`}>
                {totalActiveFilters} active filter{totalActiveFilters !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
        
        {!showMobileFilter && totalActiveFilters === 0 && (
          <div className="flex items-center gap-2 text-base text-gray-500">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">Tap to explore</span>
            <ChevronDown className="h-5 w-5" />
          </div>
        )}
      </Button>

      {/* Enhanced Quick Access when filters are hidden */}
      {!showMobileFilter && totalActiveFilters > 0 && (
        <div className="flex gap-3 px-2">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setShowMobileFilter(true)}
            className="flex-1 h-14 text-base font-semibold text-gray-700 hover:text-gray-900 
                     hover:bg-gray-100 rounded-2xl border-2 border-gray-200 hover:border-gray-300
                     bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg
                     transition-all duration-300 hover:scale-[1.02]"
          >
            <Search className="h-5 w-5 mr-3" />
            Edit Filters
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="h-14 px-6 text-base font-semibold text-red-600 hover:text-red-700 
                     hover:bg-red-50 rounded-2xl border-2 border-red-200 hover:border-red-300
                     bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg
                     transition-all duration-300 hover:scale-[1.02]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileFilterToggle;
