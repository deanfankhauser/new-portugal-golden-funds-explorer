
import React, { lazy, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFundFiltering } from '../hooks/useFundFiltering';
import PageSEO from '../components/common/PageSEO';
import HomepageLayout from '../components/homepage/HomepageLayout';
import HomepageHero from '../components/homepage/HomepageHero';
import HomepageContent from '../components/homepage/HomepageContent';
import FundListSkeleton from '../components/common/FundListSkeleton';

// Lazy load non-critical components
const HomepageInfoSections = lazy(() => import('../components/homepage/HomepageInfoSections'));

const IndexPage = () => {
  const { isAuthenticated } = useAuth();
  const {
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    filteredFunds,
    showOnlyGVEligible,
    setShowOnlyGVEligible
  } = useFundFiltering();

  return (
    <HomepageLayout>
      <PageSEO pageType="homepage" />
      
      <HomepageHero isAuthenticated={isAuthenticated} />

      <HomepageContent
        filteredFunds={filteredFunds}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAuthenticated={isAuthenticated}
        showOnlyGVEligible={showOnlyGVEligible}
        setShowOnlyGVEligible={setShowOnlyGVEligible}
      />

      <section className="mt-12 sm:mt-16 lg:mt-20" aria-label="Additional resources">
        <Suspense fallback={<FundListSkeleton />}>
          <HomepageInfoSections />
        </Suspense>
      </section>
    </HomepageLayout>
  );
};

export default IndexPage;
