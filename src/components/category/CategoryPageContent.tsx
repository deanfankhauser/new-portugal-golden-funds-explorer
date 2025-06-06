
import React from 'react';
import { Fund } from '../../data/funds';
import Header from '../Header';
import Footer from '../Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

// Import existing components
import CategoryBreadcrumbs from './CategoryBreadcrumbs';
import CategoryPageHeader from './CategoryPageHeader';
import CategoryPageFundSummary from './CategoryPageFundSummary';
import CategoryPageEmptyState from './CategoryPageEmptyState';
import CategoryPageFundList from './CategoryPageFundList';
import RelatedCategories from './RelatedCategories';
import CategoryPageSEO from './CategoryPageSEO';
import CategoryPageFAQ from './CategoryPageFAQ';

interface CategoryPageContentProps {
  category: string;
  categorySlug: string;
  funds: Fund[];
  allCategories: string[];
  navigate: (path: string) => void;
}

const CategoryPageContent: React.FC<CategoryPageContentProps> = ({
  category,
  categorySlug,
  funds,
  allCategories,
  navigate
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* SEO Component */}
      <CategoryPageSEO 
        categoryName={category} 
        categorySlug={categorySlug} 
        fundsCount={funds.length} 
        funds={funds} 
      />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1" itemScope itemType="https://schema.org/CollectionPage">
        {/* Breadcrumbs */}
        <CategoryBreadcrumbs categoryName={category} />
        
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
        <CategoryPageHeader categoryName={category} />
        
        {/* Fund Display Section */}
        {funds.length === 0 ? (
          <CategoryPageEmptyState categoryName={category} />
        ) : (
          <>
            <CategoryPageFundSummary count={funds.length} categoryName={category} />
            <CategoryPageFundList funds={funds} />
            <RelatedCategories allCategories={allCategories} currentCategory={category} />
            
            {/* FAQ Section */}
            <CategoryPageFAQ 
              categoryName={category} 
              categorySlug={categorySlug} 
              fundsCount={funds.length} 
            />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPageContent;
