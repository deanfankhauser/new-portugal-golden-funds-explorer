
import React from 'react';
import { Fund, FundTag, FundCategory } from '../../data/funds';
import StreamlinedFilter from './StreamlinedFilter';
import CategoryFilter from './CategoryFilter';
import ManagerFilter from './ManagerFilter';
import FundListSkeleton from '../common/FundListSkeleton';
import HomepageSidebar from './HomepageSidebar';
import ResultsHeader from './ResultsHeader';
import EmptyFundsState from './EmptyFundsState';
import FundsList from './FundsList';


interface HomepageContentProps {
  filteredFunds: Fund[];
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
  selectedCategory: FundCategory | null;
  setSelectedCategory: (category: FundCategory | null) => void;
  selectedManager: string | null;
  setSelectedManager: (manager: string | null) => void;
  searchQuery: string;
  allFunds?: Fund[];
  loading?: boolean;
  error?: string | null;
}

const HomepageContent: React.FC<HomepageContentProps> = ({
  filteredFunds,
  selectedTags,
  setSelectedTags,
  selectedCategory,
  setSelectedCategory,
  selectedManager,
  setSelectedManager,
  searchQuery,
  allFunds = [],
  loading = false,
  error = null
}) => {
  const hasActiveFilters = selectedTags.length > 0 || searchQuery.trim() !== '' || 
    selectedCategory !== null || selectedManager !== null;

  return (
    <div className="spacing-responsive-md">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Mobile filter - always visible */}
      <div className="lg:hidden mb-6 space-y-4">
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <ManagerFilter
            selectedManager={selectedManager}
            setSelectedManager={setSelectedManager}
          />
        </div>
        
        <StreamlinedFilter
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <HomepageSidebar
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
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
              setSearchQuery={() => {}}
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
                setSearchQuery={() => {}}
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
