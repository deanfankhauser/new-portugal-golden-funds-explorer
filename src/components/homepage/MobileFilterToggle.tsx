
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface MobileFilterToggleProps {
  showMobileFilter: boolean;
  setShowMobileFilter: (show: boolean) => void;
}

const MobileFilterToggle: React.FC<MobileFilterToggleProps> = ({
  showMobileFilter,
  setShowMobileFilter
}) => {
  return (
    <div className="lg:hidden mb-6">
      <Button
        onClick={() => setShowMobileFilter(!showMobileFilter)}
        variant="outline"
        className="w-full justify-center gap-3 bg-white border-gray-200 hover:bg-gray-50 
                   h-14 text-base font-medium interactive-hover btn-secondary-enhanced"
        aria-expanded={showMobileFilter}
        aria-controls="mobile-filter-section"
        aria-label={showMobileFilter ? "Hide search and filters" : "Show search and filters"}
      >
        {showMobileFilter ? (
          <>
            <X className="h-5 w-5" aria-hidden="true" />
            Hide Search & Filters
          </>
        ) : (
          <>
            <Search className="h-5 w-5" aria-hidden="true" />
            Search & Filter Funds
          </>
        )}
      </Button>
    </div>
  );
};

export default MobileFilterToggle;
