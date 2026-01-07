
import React, { useEffect } from 'react';
import { getAllTags } from '../data/services/tags-service';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import TagsHubBreadcrumbs from '../components/tags-hub/TagsHubBreadcrumbs';
import TagsHubHeader from '../components/tags-hub/TagsHubHeader';
import TagsHubTagsList from '../components/tags-hub/TagsHubTagsList';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import FundListSkeleton from '../components/common/FundListSkeleton';
import { Fund } from '../data/types/funds';

interface TagsHubProps {
  initialFunds?: Fund[];
}

const TagsHub: React.FC<TagsHubProps> = ({ initialFunds }) => {
  const { funds: allFundsData, loading: isLoading } = useRealTimeFunds({
    initialData: initialFunds
  });
  const allDatabaseFunds = allFundsData || [];
  const allTags = getAllTags(allDatabaseFunds);
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  // Only show loading when no initial data was provided
  if (isLoading && !initialFunds) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1">
          <FundListSkeleton count={6} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="tags-hub" />
      
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1" itemScope itemType="https://schema.org/CollectionPage">
        <TagsHubBreadcrumbs />
        <TagsHubHeader />
        <TagsHubTagsList allTags={allTags} allFunds={allDatabaseFunds} />
      </main>
      
      <Footer />
    </div>
  );
};

export default TagsHub;
