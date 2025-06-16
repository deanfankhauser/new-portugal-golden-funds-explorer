
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFundsByTag } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import TagBreadcrumbs from '../components/tag/TagBreadcrumbs';
import TagPageHeader from '../components/tag/TagPageHeader';
import TagPageFundSummary from '../components/tag/TagPageFundSummary';
import TagPageFundList from '../components/tag/TagPageFundList';
import TagPageEmptyState from '../components/tag/TagPageEmptyState';
import TagPageFAQ from '../components/tag/TagPageFAQ';
import RelatedTags from '../components/tag/RelatedTags';

const TagPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const tagName = tag?.replace(/-/g, ' ') || '';
  const funds = getFundsByTag(tagName);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tag]);

  if (!tag) {
    return <TagPageEmptyState />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="tag" tagName={tagName} />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1" itemScope itemType="https://schema.org/CollectionPage">
        <TagBreadcrumbs tagName={tagName} />
        <TagPageHeader tagName={tagName} />
        
        {funds.length > 0 ? (
          <>
            <TagPageFundSummary tagName={tagName} fundCount={funds.length} />
            <TagPageFundList funds={funds} />
          </>
        ) : (
          <TagPageEmptyState />
        )}
        
        <TagPageFAQ tagName={tagName} />
        <RelatedTags currentTag={tagName} />
      </main>
      
      <Footer />
    </div>
  );
};

export default TagPage;
