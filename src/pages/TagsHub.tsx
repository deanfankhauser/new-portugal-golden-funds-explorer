
import React, { useEffect } from 'react';
import { getAllTags } from '../data/services/tags-service';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import TagsHubBreadcrumbs from '../components/tags-hub/TagsHubBreadcrumbs';
import TagsHubHeader from '../components/tags-hub/TagsHubHeader';
import TagsHubTagsList from '../components/tags-hub/TagsHubTagsList';
import { useAllFunds } from '../hooks/useFundsQuery';
import FundListSkeleton from '../components/common/FundListSkeleton';

const TagsHub = () => {
  const { data: allFundsData, isLoading } = useAllFunds();
  const allDatabaseFunds = allFundsData || [];
  const allTags = getAllTags(allDatabaseFunds);
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
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
        <TagsHubTagsList allTags={allTags} />
      </main>
      
      <Footer />
    </div>
  );
};

export default TagsHub;
