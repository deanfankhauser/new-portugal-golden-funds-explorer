
import React, { lazy, Suspense, useRef } from 'react';
import { useFundFiltering } from '../hooks/useFundFiltering';
import PageSEO from '../components/common/PageSEO';
import HomepageLayout from '../components/homepage/HomepageLayout';
import SearchFirstHero from '../components/homepage-v2/SearchFirstHero';
import PopularCategoriesTiles from '../components/homepage-v2/PopularCategoriesTiles';
import VerifiedFundsCarousel from '../components/homepage-v2/VerifiedFundsCarousel';
import ManagersCarousel from '../components/homepage-v2/ManagersCarousel';
import CompareShortlistCallout from '../components/homepage-v2/CompareShortlistCallout';
import HowVerificationWorks from '../components/homepage-v2/HowVerificationWorks';
import HomepageContent from '../components/homepage/HomepageContent';
import FundListSkeleton from '../components/common/FundListSkeleton';
import { FloatingActionButton } from '../components/common/FloatingActionButton';
import StickyHelpBar from '../components/common/StickyHelpBar';
import type { Fund } from '../data/types/funds';

interface IndexPageProps {
  initialFunds?: Fund[];
}

const IndexPage: React.FC<IndexPageProps> = ({ initialFunds }) => {
  const fundsSectionRef = useRef<HTMLDivElement>(null);
  
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
  } = useFundFiltering({ initialFunds });

  const scrollToFunds = () => {
    fundsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Show loading skeleton only during initial load when no data exists and no initial data was provided
  if (loading && !initialFunds && (!allFunds || allFunds.length === 0)) {
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
      
      {/* 1. Search-First Hero */}
      <SearchFirstHero onBrowseResults={scrollToFunds} />

      {/* 2. Popular Categories */}
      <PopularCategoriesTiles />

      {/* 3. Verified Funds Carousel */}
      <VerifiedFundsCarousel funds={allFunds || []} />

      {/* 4. Fund Managers Carousel */}
      <ManagersCarousel funds={allFunds || []} />

      {/* 5. Compare + Shortlist Callouts */}
      <CompareShortlistCallout />

      {/* 6. How Verification Works */}
      <HowVerificationWorks />


      <FloatingActionButton />
      <StickyHelpBar />
    </HomepageLayout>
  );
};

export default IndexPage;
