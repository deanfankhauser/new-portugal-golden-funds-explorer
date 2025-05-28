
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFundsByTag, getAllTags } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { slugToTag } from '@/lib/utils';
import PremiumCTA from '../components/cta/PremiumCTA';

// Import our components
import TagBreadcrumbs from '../components/tag/TagBreadcrumbs';
import TagPageHeader from '../components/tag/TagPageHeader';
import TagPageFundSummary from '../components/tag/TagPageFundSummary';
import TagPageEmptyState from '../components/tag/TagPageEmptyState';
import TagPageFundList from '../components/tag/TagPageFundList';
import RelatedTags from '../components/tag/RelatedTags';
import TagPageSEO from '../components/tag/TagPageSEO';
import TagPageFAQ from '../components/tag/TagPageFAQ';

const TagPage = () => {
  const { tag: tagSlug } = useParams<{ tag: string }>();
  const navigate = useNavigate();
  
  // Convert slug back to tag format
  const tagName = tagSlug ? slugToTag(tagSlug) : '';
  const allTags = getAllTags();
  
  // Check if the tag exists
  const tagExists = allTags.includes(tagName as any);
  const funds = tagExists ? getFundsByTag(tagName as any) : [];

  // If tag doesn't exist, redirect to homepage
  React.useEffect(() => {
    if (!tagExists) {
      navigate('/');
    }
  }, [tagExists, navigate]);

  if (!tagExists) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* SEO Component */}
      <TagPageSEO 
        tagName={tagName} 
        tagSlug={tagSlug} 
        fundsCount={funds.length} 
        funds={funds} 
      />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1" itemScope itemType="https://schema.org/CollectionPage">
        {/* Breadcrumbs */}
        <TagBreadcrumbs tagName={tagName} tagSlug={tagSlug || ''} />

        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center text-black hover:bg-[#f0f0f0] text-sm sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Back to all funds
          </Button>
        </div>

        {/* Page Header */}
        <TagPageHeader tagName={tagName} />
        
        {/* Premium CTA Banner for tag-specific insights */}
        <div className="mb-6 sm:mb-8">
          <PremiumCTA variant="banner" location={`tag-${tagSlug}`} />
        </div>
        
        {/* Fund Display Section */}
        {funds.length === 0 ? (
          <TagPageEmptyState tagName={tagName} />
        ) : (
          <>
            <TagPageFundSummary count={funds.length} tagName={tagName} />
            <TagPageFundList funds={funds} />
            
            {/* FAQ Section */}
            <TagPageFAQ 
              tagName={tagName} 
              tagSlug={tagSlug || ''} 
              fundsCount={funds.length} 
            />
            
            <RelatedTags allTags={allTags} currentTag={tagName} />
            
            {/* Premium CTA at bottom of tag page */}
            <div className="mt-10 sm:mt-12">
              <PremiumCTA variant="full" location={`tag-bottom-${tagSlug}`} />
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default TagPage;
