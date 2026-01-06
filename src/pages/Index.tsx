import React from 'react';
import { useFundFiltering } from '../hooks/useFundFiltering';
import PageSEO from '../components/common/PageSEO';
import HomepageLayout from '../components/homepage/HomepageLayout';
import SearchFirstHero from '../components/homepage-v2/SearchFirstHero';
import BestShortlistPreview from '../components/homepage-v2/BestShortlistPreview';
import VerifiedFundsCarousel from '../components/homepage-v2/VerifiedFundsCarousel';
import ManagersCarousel from '../components/homepage-v2/ManagersCarousel';
import TeamMembersCarousel from '../components/homepage-v2/TeamMembersCarousel';
import PrimaryActionsStrip from '../components/homepage-v2/PrimaryActionsStrip';
import HowVerificationWorks from '../components/homepage-v2/HowVerificationWorks';
import HomepageFAQAccordion from '../components/homepage-v2/HomepageFAQAccordion';
import ResourceLinkGrid from '../components/homepage-v2/ResourceLinkGrid';
import FundListSkeleton from '../components/common/FundListSkeleton';
import { FloatingActionButton } from '../components/common/FloatingActionButton';
import StickyHelpBar from '../components/common/StickyHelpBar';
import type { Fund } from '../data/types/funds';

interface IndexPageProps {
  initialFunds?: Fund[];
}

const IndexPage: React.FC<IndexPageProps> = ({ initialFunds }) => {
  const {
    allFunds,
    loading,
  } = useFundFiltering({ initialFunds });

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
      <SearchFirstHero />

      {/* 2. Verified Funds Carousel */}
      <VerifiedFundsCarousel funds={allFunds || []} />

      {/* 3. Fund Managers Carousel */}
      <ManagersCarousel funds={allFunds || []} />

      {/* 4. Team Members Carousel */}
      <TeamMembersCarousel />

      {/* 4. Best Funds Teaser */}
      <BestShortlistPreview funds={allFunds || []} />

      {/* 5. Primary Actions (Compare / Shortlist / Matcher) */}
      <PrimaryActionsStrip />

      {/* 6. How Verification Works */}
      <HowVerificationWorks />

      {/* 7. Curated FAQ */}
      <HomepageFAQAccordion />

      {/* 8. Resource Links */}
      <ResourceLinkGrid />

      <FloatingActionButton />
      <StickyHelpBar />
    </HomepageLayout>
  );
};

export default IndexPage;
