
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
  
  // Processing tag slug and available tags
  
  // Enhanced matching logic with multiple strategies
  let matchingTag: string | null = null;
  let displayTagName = '';
  
  if (tagSlug) {
    // Strategy 1: Direct special case matching for management fees
    if (tagSlug === '-15-management-fee' || tagSlug === '15-management-fee') {
      matchingTag = allTags.find(tag => tag.includes('> 1.5% management')) || null;
      // Special case match for > 1.5% management fee
    } else if (tagSlug === '-1-management-fee' || tagSlug === '1-management-fee') {
      matchingTag = allTags.find(tag => tag.includes('< 1% management')) || null;
      // Special case match for < 1% management fee
    } else if (tagSlug === '-1-1-5-management-fee' || tagSlug === '1-1-5-management-fee') {
      matchingTag = allTags.find(tag => tag.includes('1-1.5% management')) || null;
      // Special case match for 1-1.5% management fee
    }
    
    // Strategy 2: Exact slug match
    if (!matchingTag) {
      matchingTag = allTags.find(tag => tagToSlug(tag) === tagSlug) || null;
      // Exact slug match attempted
    }
    
    // Strategy 3: Try matching without leading dashes
    if (!matchingTag && tagSlug.startsWith('-')) {
      const cleanSlug = tagSlug.replace(/^-+/, '');
      matchingTag = allTags.find(tag => tagToSlug(tag) === cleanSlug) || null;
      // Clean slug match attempted
    }
    
    // Strategy 4: Fuzzy matching by converting slug back to tag and finding similar
    if (!matchingTag) {
      const convertedTag = slugToTag(tagSlug);
      matchingTag = allTags.find(tag => 
        tag.toLowerCase().includes(convertedTag.toLowerCase()) ||
        convertedTag.toLowerCase().includes(tag.toLowerCase())
      ) || null;
      // Fuzzy match attempted
    }
    
    displayTagName = matchingTag || slugToTag(tagSlug);
    
    // Final matching results processed
  }
  
  const tagExists = !!matchingTag;
  const funds = tagExists ? getFundsByTag(matchingTag as FundTag) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Final processing completed
  }, [tagSlug, matchingTag, displayTagName, tagExists]);

  if (!tagExists) {
    // Tag not found, showing empty state
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

  // Rendering tag page with SEO

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
