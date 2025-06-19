
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFundsByTag, getAllTags } from '../data/funds';
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
import { FundTag } from '../data/types/funds';
import { slugToTag, tagToSlug } from '../lib/utils';

const TagPage = () => {
  const { tag: tagSlug } = useParams<{ tag: string }>();
  const tagName = tagSlug ? slugToTag(tagSlug) : '';
  const allTags = getAllTags();
  
  // Debug logging to help identify the issue
  console.log('TagPage Debug Info:');
  console.log('Tag slug from URL:', tagSlug);
  console.log('Converted tag name:', tagName);
  console.log('All available tags:', allTags);
  console.log('Tag exists in allTags:', allTags.includes(tagName as FundTag));
  
  // Validate tag exists
  const tagExists = allTags.includes(tagName as FundTag);
  const funds = tagExists ? getFundsByTag(tagName as FundTag) : [];
  
  console.log('Funds found for tag:', funds.length);
  if (funds.length > 0) {
    console.log('Sample fund tags:', funds[0].tags);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tagSlug]);

  if (!tagExists) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <TagPageEmptyState tagName={tagName} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="tag" tagName={tagName} />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1" itemScope itemType="https://schema.org/CollectionPage">
        <TagBreadcrumbs tagName={tagName} tagSlug={tagSlug || ''} />
        <TagPageHeader tagName={tagName} />
        
        {funds.length > 0 ? (
          <>
            <TagPageFundSummary count={funds.length} tagName={tagName} />
            <TagPageFundList funds={funds} />
          </>
        ) : (
          <TagPageEmptyState tagName={tagName} />
        )}
        
        <TagPageFAQ tagName={tagName} tagSlug={tagSlug || ''} fundsCount={funds.length} />
        <RelatedTags allTags={allTags} currentTag={tagName} />
      </main>
      
      <Footer />
    </div>
  );
};

export default TagPage;
