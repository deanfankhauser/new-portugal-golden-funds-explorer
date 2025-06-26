
import React, { useState } from 'react';
import { Fund, FundTag } from '../../data/funds';
import FundFilter from '../FundFilter';
import FundListSkeleton from '../common/FundListSkeleton';
import MobileFilterToggle from './MobileFilterToggle';
import HomepageSidebar from './HomepageSidebar';
import ResultsHeader from './ResultsHeader';
import EmptyFundsState from './EmptyFundsState';
import FundsList from './FundsList';
import MobileFundQuizCTA from './MobileFundQuizCTA';

interface HomepageContentProps {
  filteredFunds: Fund[];
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAuthenticated: boolean;
}

const HomepageContent: React.FC<HomepageContentProps> = ({
  filteredFunds,
  selectedTags,
  setSelectedTags,
  searchQuery,
  setSearchQuery,
  isAuthenticated
}) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [isLoading] = useState(false);

  return (
    <div className="spacing-responsive-md">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <MobileFilterToggle 
        showMobileFilter={showMobileFilter}
        setShowMobileFilter={setShowMobileFilter}
      />

      {showMobileFilter && (
        <div className="lg:hidden mb-6" id="mobile-filter-section">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm card-hover-effect">
            <FundFilter
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
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
                isAuthenticated={isAuthenticated}
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
