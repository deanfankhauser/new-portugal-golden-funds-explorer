
import React, { useEffect } from 'react';
import { getAllTags } from '../data/services/tags-service';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import TagsHubBreadcrumbs from '../components/tags-hub/TagsHubBreadcrumbs';
import TagsHubHeader from '../components/tags-hub/TagsHubHeader';
import TagsHubTagsList from '../components/tags-hub/TagsHubTagsList';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import FundListSkeleton from '../components/common/FundListSkeleton';
import { Fund } from '../data/types/funds';

interface TagsHubProps {
  initialFunds?: Fund[];
}

const TagsHub: React.FC<TagsHubProps> = ({ initialFunds }) => {
  const { funds: allFundsData, loading: isLoading } = useRealTimeFunds({
    initialData: initialFunds
  });
  const allDatabaseFunds = allFundsData || [];
  const allTags = getAllTags(allDatabaseFunds);
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  // Only show loading when no initial data was provided
  if (isLoading && !initialFunds) {
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
        <TagsHubTagsList allTags={allTags} allFunds={allDatabaseFunds} />
        
        {/* Link to Main Hub */}
        <div className="mt-8 text-center">
          <a 
            href="https://www.movingto.com/portugal-golden-visa-funds" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
          >
            Browse All Portugal Golden Visa Funds
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TagsHub;
