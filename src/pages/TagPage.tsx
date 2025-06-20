
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
  const allTags = getAllTags();
  
  console.log('🔥 TagPage: Processing tag slug:', tagSlug);
  console.log('🔥 TagPage: All available tags:', allTags);
  
  // Enhanced matching logic with multiple strategies
  let matchingTag: string | null = null;
  let displayTagName = '';
  
  if (tagSlug) {
    // Strategy 1: Direct special case matching for management fees
    if (tagSlug === '-15-management-fee' || tagSlug === '15-management-fee') {
      matchingTag = allTags.find(tag => tag.includes('> 1.5% management')) || null;
      console.log('🔥 TagPage: Special case match for > 1.5% management fee:', matchingTag);
    } else if (tagSlug === '-1-management-fee' || tagSlug === '1-management-fee') {
      matchingTag = allTags.find(tag => tag.includes('< 1% management')) || null;
      console.log('🔥 TagPage: Special case match for < 1% management fee:', matchingTag);
    } else if (tagSlug === '-1-1-5-management-fee' || tagSlug === '1-1-5-management-fee') {
      matchingTag = allTags.find(tag => tag.includes('1-1.5% management')) || null;
      console.log('🔥 TagPage: Special case match for 1-1.5% management fee:', matchingTag);
    }
    
    // Strategy 2: Exact slug match
    if (!matchingTag) {
      matchingTag = allTags.find(tag => tagToSlug(tag) === tagSlug) || null;
      console.log('🔥 TagPage: Exact slug match result:', matchingTag);
    }
    
    // Strategy 3: Try matching without leading dashes
    if (!matchingTag && tagSlug.startsWith('-')) {
      const cleanSlug = tagSlug.replace(/^-+/, '');
      matchingTag = allTags.find(tag => tagToSlug(tag) === cleanSlug) || null;
      console.log('🔥 TagPage: Clean slug match result:', matchingTag);
    }
    
    // Strategy 4: Fuzzy matching by converting slug back to tag and finding similar
    if (!matchingTag) {
      const convertedTag = slugToTag(tagSlug);
      matchingTag = allTags.find(tag => 
        tag.toLowerCase().includes(convertedTag.toLowerCase()) ||
        convertedTag.toLowerCase().includes(tag.toLowerCase())
      ) || null;
      console.log('🔥 TagPage: Fuzzy match result:', matchingTag);
    }
    
    displayTagName = matchingTag || slugToTag(tagSlug);
    
    console.log('🔥 TagPage: Final matching results:', {
      tagSlug,
      matchingTag,
      displayTagName,
      tagExists: !!matchingTag
    });
  }
  
  const tagExists = !!matchingTag;
  const funds = tagExists ? getFundsByTag(matchingTag as FundTag) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
    
    console.log('🔥 TagPage: Final processing results:', {
      tagSlug,
      matchingTag,
      displayTagName,
      tagExists,
      fundsCount: funds.length
    });
  }, [tagSlug, matchingTag, displayTagName, tagExists]);

  if (!tagExists) {
    console.log('🔥 TagPage: Tag not found, showing empty state');
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

  console.log('🔥 TagPage: ✅ Rendering tag page with correct SEO for:', displayTagName);

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
