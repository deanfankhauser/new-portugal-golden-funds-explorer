
import React from 'react';
import { Fund, FundTag, FundCategory } from '../../data/types/funds';
import StreamlinedFilter from './StreamlinedFilter';
import CategoryFilter from './CategoryFilter';
import ManagerFilter from './ManagerFilter';
import FundListSkeleton from '../common/FundListSkeleton';
import HomepageSidebar from './HomepageSidebar';
import ResultsHeader from './ResultsHeader';
import EmptyFundsState from './EmptyFundsState';
import FundsList from './FundsList';
import BackToTopButton from './BackToTopButton';
import MobileFilterButton from './MobileFilterButton';


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
  const [sortBy, setSortBy] = React.useState<string>('verified');
  const [searchQueryState, setSearchQueryState] = React.useState<string>(searchQuery);

  const hasActiveFilters = selectedTags.length > 0 || searchQuery.trim() !== '' || 
    selectedCategory !== null || selectedManager !== null;

  // Sort funds based on selected option
  const sortedFunds = React.useMemo(() => {
    const funds = [...filteredFunds];
    
    switch (sortBy) {
      case 'verified':
        return funds.sort((a, b) => {
          if (a.isVerified === b.isVerified) return 0;
          return a.isVerified ? -1 : 1;
        });
      
      case 'min-investment-asc':
        return funds.sort((a, b) => {
          const aMin = a.minimumInvestment || Infinity;
          const bMin = b.minimumInvestment || Infinity;
          return aMin - bMin;
        });
      
      case 'target-return-desc':
        return funds.sort((a, b) => {
          const aReturn = a.expectedReturnMax || a.expectedReturnMin || 0;
          const bReturn = b.expectedReturnMax || b.expectedReturnMin || 0;
          return bReturn - aReturn;
        });
      
      case 'risk-asc':
        return funds.sort((a, b) => {
          const getRiskScore = (fund: typeof funds[0]) => {
            if (fund.tags.includes('Low-risk')) return 1;
            if (fund.tags.includes('Medium-risk')) return 2;
            if (fund.tags.includes('High-risk')) return 3;
            return 2; // default to medium if not specified
          };
          return getRiskScore(a) - getRiskScore(b);
        });
      
      case 'newly-added':
      default:
        return funds.sort((a, b) => {
          const aDate = new Date(a.datePublished || a.updatedAt || 0).getTime();
          const bDate = new Date(b.datePublished || b.updatedAt || 0).getTime();
          return bDate - aDate;
        });
    }
  }, [filteredFunds, sortBy]);

  return (
    <section id="funds-section" className="spacing-responsive-md">
      {/* Section Heading */}
      <div className="max-w-7xl mx-auto container-responsive-padding mb-8 pt-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-high-contrast text-center">
          Browse the Complete Directory
        </h2>
      </div>

      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Floating action buttons */}
      <BackToTopButton />
      <MobileFilterButton
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedManager={selectedManager}
        setSelectedManager={setSelectedManager}
      />


      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        <HomepageSidebar
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
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
          ) : sortedFunds.length === 0 ? (
            <EmptyFundsState
              setSelectedTags={setSelectedTags}
              setSearchQuery={() => {}}
              hasActiveFilters={hasActiveFilters}
              searchQuery={searchQuery}
            />
          ) : (
            <>
              <ResultsHeader
                filteredFunds={sortedFunds}
                selectedTags={selectedTags}
                searchQuery={searchQuery}
                setSelectedTags={setSelectedTags}
                setSearchQuery={setSearchQueryState}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
              
              <FundsList filteredFunds={sortedFunds} />
            </>
          )}
        </main>
      </div>
    </section>
  );
};

export default HomepageContent;
