
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
  
  console.log('TagPage: Processing tag slug:', tagSlug);
  console.log('TagPage: Available tags:', allTags);
  
  // Enhanced tag matching logic with multiple fallback strategies
  let matchingTag: string | undefined;
  let displayTagName = '';
  
  if (tagSlug) {
    // Strategy 1: Exact slug match
    matchingTag = allTags.find(tag => tagToSlug(tag) === tagSlug);
    
    // Strategy 2: If no exact match, try converting slug back and finding partial matches
    if (!matchingTag) {
      const convertedTagName = slugToTag(tagSlug);
      console.log('TagPage: No exact match, trying converted name:', convertedTagName);
      
      // Look for tags that contain the converted name or vice versa
      matchingTag = allTags.find(tag => {
        const tagLower = tag.toLowerCase();
        const convertedLower = convertedTagName.toLowerCase();
        return tagLower.includes(convertedLower) || convertedLower.includes(tagLower);
      });
      
      if (matchingTag) {
        console.log('TagPage: Found partial match:', matchingTag);
      }
    }
    
    // Strategy 3: Try handling special numeric prefixes (like "15 Management Fee")
    if (!matchingTag && tagSlug.match(/^\d+/)) {
      const withoutLeadingNumbers = tagSlug.replace(/^-*\d+\s*-*/, '');
      const convertedWithoutNumbers = slugToTag(withoutLeadingNumbers);
      console.log('TagPage: Trying without leading numbers:', convertedWithoutNumbers);
      
      matchingTag = allTags.find(tag => {
        const tagLower = tag.toLowerCase();
        const convertedLower = convertedWithoutNumbers.toLowerCase();
        return tagLower.includes(convertedLower) || convertedLower.includes(tagLower);
      });
    }
    
    // Set display name
    if (matchingTag) {
      displayTagName = matchingTag;
    } else {
      displayTagName = slugToTag(tagSlug);
    }
  }
  
  const tagExists = !!matchingTag;
  const funds = tagExists ? getFundsByTag(matchingTag as FundTag) : [];

  console.log('TagPage: Final results:', {
    tagSlug,
    matchingTag,
    displayTagName,
    tagExists,
    fundsCount: funds.length
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Enhanced debugging for tag processing
    console.log('TagPage: Detailed debugging info:', {
      tagSlug,
      matchingTag,
      displayTagName,
      tagExists,
      allAvailableTags: allTags,
      fundsCount: funds.length
    });
    
    // Force document title update as fallback with proper tag name
    if (tagExists && displayTagName) {
      const expectedTitle = `${displayTagName} Golden Visa Funds | Fund Tags | Movingto`;
      console.log('TagPage: Setting expected title:', expectedTitle);
      
      // Multiple attempts to set the title
      document.title = expectedTitle;
      setTimeout(() => {
        document.title = expectedTitle;
        console.log('TagPage: Title after timeout:', document.title);
      }, 100);
    }
  }, [tagSlug, displayTagName, tagExists, matchingTag]);

  // Add validation to ensure we pass a valid tag name to PageSEO
  const validTagName = tagExists && displayTagName ? displayTagName : '';
  
  console.log('TagPage: Passing to PageSEO:', {
    pageType: 'tag',
    tagName: validTagName,
    tagExists,
    displayTagName
  });

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
      <PageSEO pageType="tag" tagName={validTagName} />
      
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
