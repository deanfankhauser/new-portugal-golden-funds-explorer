
import React, { lazy, Suspense } from 'react';
import { useFundFiltering } from '../hooks/useFundFiltering';
import PageSEO from '../components/common/PageSEO';
import HomepageLayout from '../components/homepage/HomepageLayout';
import HomepageHero from '../components/homepage/HomepageHero';
import InvestorPathways from '../components/homepage/InvestorPathways';
import VerifiedTopPicks from '../components/homepage/VerifiedTopPicks';
import TrustIndicators from '../components/homepage/TrustIndicators';
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

  // Show loading skeleton only during initial load when no data exists
  if (loading && (!allFunds || allFunds.length === 0)) {
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
      
      {/* 1. Hero Section */}
      <HomepageHero funds={allFunds || []} />

      {/* 2. Investor Pathways */}
      <InvestorPathways />

      {/* 3. Verified Top Picks */}
      <VerifiedTopPicks funds={allFunds || []} />

      {/* 4. Trust Indicators */}
      <TrustIndicators />

      {/* 5. Full Directory */}
      <div id="funds-section">
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
      </div>

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
