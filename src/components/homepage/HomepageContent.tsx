
import React from 'react';
import { Fund, FundTag } from '../../data/funds';
import StreamlinedFilter from './StreamlinedFilter';
import FundListSkeleton from '../common/FundListSkeleton';
import HomepageSidebar from './HomepageSidebar';
import ResultsHeader from './ResultsHeader';
import EmptyFundsState from './EmptyFundsState';
import FundsList from './FundsList';


interface HomepageContentProps {
  filteredFunds: Fund[];
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  allFunds?: Fund[];
  loading?: boolean;
  error?: string | null;
}

const HomepageContent: React.FC<HomepageContentProps> = ({
  filteredFunds,
  selectedTags,
  setSelectedTags,
  searchQuery,
  setSearchQuery,
  allFunds = [],
  loading = false,
  error = null
}) => {
  const hasActiveFilters = selectedTags.length > 0 || searchQuery.trim() !== '';

  return (
    <div className="spacing-responsive-md">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Mobile filter - always visible */}
      <div className="lg:hidden mb-6">
        <StreamlinedFilter
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <HomepageSidebar
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <main className="lg:col-span-3 order-1 lg:order-2" id="main-content">
          {loading ? (
            <div role="status" aria-label="Loading funds">
              <FundListSkeleton />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive">Error loading funds: {error}</p>
              <p className="text-muted-foreground mt-2">Please try refreshing the page.</p>
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
              
              
              <FundsList
                filteredFunds={filteredFunds}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomepageContent;
