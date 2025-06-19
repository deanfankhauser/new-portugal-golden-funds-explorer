
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
  
  // Find matching tag by checking if any tag matches when converted to slug
  const matchingTag = allTags.find(tag => 
    tagToSlug(tag) === tagSlug
  );
  
  const tagExists = !!matchingTag;
  const displayTagName = matchingTag || tagName;
  const funds = tagExists ? getFundsByTag(matchingTag as FundTag) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log('TagPage: Rendering for tag:', displayTagName);
    console.log('TagPage: Tag exists:', tagExists);
    console.log('TagPage: Tag slug:', tagSlug);
  }, [tagSlug, displayTagName, tagExists]);

  if (!tagExists) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <TagPageEmptyState tagName={displayTagName} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="tag" tagName={displayTagName} />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1" itemScope itemType="https://schema.org/CollectionPage">
        <TagBreadcrumbs tagName={displayTagName} tagSlug={tagSlug || ''} />
        <TagPageHeader tagName={displayTagName} />
        
        {funds.length > 0 ? (
          <>
            <TagPageFundSummary count={funds.length} tagName={displayTagName} />
            <TagPageFundList funds={funds} />
          </>
        ) : (
          <TagPageEmptyState tagName={displayTagName} />
        )}
        
        <TagPageFAQ tagName={displayTagName} tagSlug={tagSlug || ''} fundsCount={funds.length} />
        <RelatedTags allTags={allTags} currentTag={displayTagName} />
      </main>
      
      <Footer />
    </div>
  );
};

export default TagPage;
