
import React, { useState } from 'react';
import { Fund, FundTag } from '../../data/funds';
import CompactFilter from './CompactFilter';
import FundListSkeleton from '../common/FundListSkeleton';
import MobileFilterToggle from './MobileFilterToggle';
import HomepageSidebar from './HomepageSidebar';
import ResultsHeader from './ResultsHeader';
import EmptyFundsState from './EmptyFundsState';
import FundsList from './FundsList';
import MobileFundQuizCTA from './MobileFundQuizCTA';
import DataFreshnessDashboard from '../common/DataFreshnessDashboard';

interface HomepageContentProps {
  filteredFunds: Fund[];
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  allFunds?: Fund[];
}

const HomepageContent: React.FC<HomepageContentProps> = ({
  filteredFunds,
  selectedTags,
  setSelectedTags,
  searchQuery,
  setSearchQuery,
  allFunds = []
}) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [isLoading] = useState(false);

  const hasActiveFilters = selectedTags.length > 0 || searchQuery.trim() !== '';

  return (
    <div className="spacing-responsive-md">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <MobileFilterToggle 
        showMobileFilter={showMobileFilter}
        setShowMobileFilter={setShowMobileFilter}
        activeFiltersCount={selectedTags.length}
        hasSearch={searchQuery.trim() !== ''}
      />

      {showMobileFilter && (
        <div className="lg:hidden mb-6" id="mobile-filter-section">
          <CompactFilter
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <HomepageSidebar
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <main className="lg:col-span-3 order-1 lg:order-2" id="main-content">
          {isLoading ? (
            <div role="status" aria-label="Loading funds">
              <FundListSkeleton />
            </div>
          ) : filteredFunds.length === 0 ? (
            <EmptyFundsState
              setSelectedTags={setSelectedTags}
              setSearchQuery={setSearchQuery}
              hasActiveFilters={hasActiveFilters}
              searchQuery={searchQuery}
            />
          ) : (
            <>
              <ResultsHeader
                filteredFunds={filteredFunds}
                selectedTags={selectedTags}
                searchQuery={searchQuery}
                setSelectedTags={setSelectedTags}
                setSearchQuery={setSearchQuery}
              />
              
              {/* Data Freshness Dashboard - only show when no filters applied */}
              {!hasActiveFilters && allFunds.length > 0 && (
                <div className="mb-8">
                  <DataFreshnessDashboard funds={allFunds} />
                </div>
              )}
              
              <FundsList
                filteredFunds={filteredFunds}
              />
            </>
          )}
        </main>
      </div>

      <MobileFundQuizCTA />
    </div>
  );
};

export default HomepageContent;
