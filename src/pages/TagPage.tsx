
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getFundsByTag } from '../data/services/tags-service';
import { getAllTags } from '../data/services/tags-service';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import TagBreadcrumbs from '../components/tag/TagBreadcrumbs';
import TagThemeHero from '../components/tag/TagThemeHero';
import TagPageFundList from '../components/tag/TagPageFundList';
import TagPageEmptyState from '../components/tag/TagPageEmptyState';
import TagPageFAQ from '../components/tag/TagPageFAQ';
import RelatedTags from '../components/tag/RelatedTags';
import VerificationFilterChip from '../components/common/VerificationFilterChip';
import { FundTag } from '../data/types/funds';
import { slugToTag, tagToSlug } from '../lib/utils';
import { FloatingActionButton } from '../components/common/FloatingActionButton';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import FundListSkeleton from '../components/common/FundListSkeleton';
import { Fund } from '../data/types/funds';

interface TagPageProps {
  tagData?: {
    tagName: string;
    tagSlug: string;
    funds: Fund[];
  };
  initialFunds?: Fund[];
}

const TagPage: React.FC<TagPageProps> = ({ tagData: ssrData, initialFunds }) => {
  const { tag: tagSlug } = useParams<{ tag: string }>();
  const { funds: allFundsData, loading: isLoading } = useRealTimeFunds({
    initialData: initialFunds || (ssrData ? ssrData.funds : undefined)
  });
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  
  // Use SSR data if available, otherwise fetch from hook
  const allDatabaseFunds = ssrData ? ssrData.funds : (allFundsData || []);
  const allTags = getAllTags(allDatabaseFunds);
  
  // Processing tag slug and available tags
  
  // Enhanced matching logic with multiple strategies
  let matchingTag: string | null = null;
  let displayTagName = '';
  
  if (tagSlug) {
    // Strategy 1: Direct special case matching for low fees tag
    if (tagSlug === 'low-fees') {
      matchingTag = allTags.find(tag => tag.includes('Low fees')) || null;
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
  const allFunds = tagExists ? getFundsByTag(allDatabaseFunds, matchingTag as FundTag) : [];
  
  // Filter funds by verification status
  const funds = useMemo(() => {
    if (!showOnlyVerified) return allFunds;
    return allFunds.filter(fund => fund.isVerified);
  }, [allFunds, showOnlyVerified]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Final processing completed
  }, [tagSlug, matchingTag, displayTagName, tagExists]);

  // Show loading state only when no initial data provided
  if (isLoading && !initialFunds && !ssrData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <FundListSkeleton count={6} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!tagExists) {
    // Tag not found, showing empty state
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <TagPageEmptyState tagName={displayTagName} allFunds={allDatabaseFunds} />
        </main>
        <Footer />
      </div>
    );
  }

  // Rendering tag page with SEO

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="tag" tagName={displayTagName} funds={funds} />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1" itemScope itemType="https://schema.org/CollectionPage">
        <TagBreadcrumbs tagName={displayTagName} tagSlug={tagSlug || ''} />
        <TagThemeHero tagName={displayTagName} funds={allFunds} />
        
        
        {/* Verification Filter */}
        <div className="mb-6">
          <VerificationFilterChip 
            showOnlyVerified={showOnlyVerified}
            setShowOnlyVerified={setShowOnlyVerified}
          />
        </div>
        
        {funds.length > 0 ? (
          <>
            <TagPageFundList funds={funds} />
          </>
        ) : showOnlyVerified && allFunds.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No verified funds found with the tag "{displayTagName}".
            </p>
            <p className="text-muted-foreground mt-2">
              Try disabling the verification filter to see all {allFunds.length} funds.
            </p>
          </div>
        ) : (
          <TagPageEmptyState tagName={displayTagName} allFunds={allDatabaseFunds} />
        )}
        
        <TagPageFAQ tagName={displayTagName} tagSlug={tagSlug || ''} fundsCount={funds.length} />
        <RelatedTags allTags={allTags} currentTag={displayTagName} />
      </main>
      
      <Footer />
      
      <FloatingActionButton />
    </div>
  );
};

export default TagPage;
