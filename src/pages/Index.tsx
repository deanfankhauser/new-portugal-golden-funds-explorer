
import React, { lazy, Suspense } from 'react';
import { useFundFiltering } from '../hooks/useFundFiltering';
import PageSEO from '../components/common/PageSEO';
import HomepageLayout from '../components/homepage/HomepageLayout';
import HomepageHero from '../components/homepage/HomepageHero';
import HomepageContent from '../components/homepage/HomepageContent';
import FundListSkeleton from '../components/common/FundListSkeleton';
import { FloatingActionButton } from '../components/common/FloatingActionButton';
import StickyHelpBar from '../components/common/StickyHelpBar';

// Lazy load non-critical components
const HomepageInfoSections = lazy(() => import('../components/homepage/HomepageInfoSections'));

const IndexPage = () => {
  const {
    selectedTags,
    setSelectedTags,
    selectedCategory,
    setSelectedCategory,
    selectedManager,
    setSelectedManager,
    showOnlyVerified,
    setShowOnlyVerified,
    searchQuery,
    filteredFunds,
    allFunds,
    loading,
    error
  } = useFundFiltering();

  // Show loading skeleton while fetching data OR during error retry states
  // This prevents showing empty state during slow connections or Supabase issues
  if (loading || error) {
    return (
      <HomepageLayout>
        <PageSEO pageType="homepage" />
        <div className="container mx-auto px-4 py-8">
          <FundListSkeleton />
        </div>
      </HomepageLayout>
    );
  }

  return (
    <HomepageLayout>
      <PageSEO pageType="homepage" />
      
      <HomepageHero funds={allFunds || []} />

      <HomepageContent
        filteredFunds={filteredFunds}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedManager={selectedManager}
        setSelectedManager={setSelectedManager}
        showOnlyVerified={showOnlyVerified}
        setShowOnlyVerified={setShowOnlyVerified}
        searchQuery={searchQuery}
        allFunds={allFunds}
        loading={loading}
        error={error ? String(error) : undefined}
      />

      <section className="mt-12 sm:mt-16 lg:mt-20 mb-16 md:mb-0" aria-label="Additional resources">
        <Suspense fallback={<FundListSkeleton />}>
          <HomepageInfoSections />
        </Suspense>
      </section>

      <FloatingActionButton />
      <StickyHelpBar />
    </HomepageLayout>
  );
};

export default IndexPage;
