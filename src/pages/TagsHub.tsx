
import React, { useEffect } from 'react';
import { getAllTags } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import TagsHubBreadcrumbs from '../components/tags-hub/TagsHubBreadcrumbs';
import TagsHubHeader from '../components/tags-hub/TagsHubHeader';
import TagsHubTagsList from '../components/tags-hub/TagsHubTagsList';

const TagsHub = () => {
  const allTags = getAllTags();
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

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
