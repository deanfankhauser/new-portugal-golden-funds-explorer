
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFundsByCategory, getAllCategories } from '../data/funds';
import { slugToCategory } from '@/lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import PremiumCTA from '../components/cta/PremiumCTA';
import PageSEO from '../components/common/PageSEO';

// Import our components
import CategoryBreadcrumbs from '../components/category/CategoryBreadcrumbs';
import CategoryPageHeader from '../components/category/CategoryPageHeader';
import CategoryPageFundSummary from '../components/category/CategoryPageFundSummary';
import CategoryPageEmptyState from '../components/category/CategoryPageEmptyState';
import CategoryPageFundList from '../components/category/CategoryPageFundList';
import RelatedCategories from '../components/category/RelatedCategories';
import CategoryPageFAQ from '../components/category/CategoryPageFAQ';

const CategoryPage = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  // Convert URL slug to actual category
  const category = categorySlug ? slugToCategory(categorySlug) : '';
  const allCategories = getAllCategories();
  
  // Check if the category exists
  const categoryExists = allCategories.includes(category as any);
  const funds = categoryExists ? getFundsByCategory(category as any) : [];

  // If category doesn't exist, redirect to homepage
  React.useEffect(() => {
    if (!categoryExists) {
      navigate('/');
    }
  }, [categoryExists, navigate]);

  if (!categoryExists) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* SEO Component */}
      <PageSEO pageType="category" categoryName={category} />
      
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
        
        {/* Premium CTA Banner for category-specific insights */}
        <div className="mb-6 sm:mb-8">
          <PremiumCTA variant="banner" location={`category-${categorySlug}`} />
        </div>
        
        {/* Fund Display Section */}
        {funds.length === 0 ? (
          <CategoryPageEmptyState categoryName={category} />
        ) : (
          <>
            <CategoryPageFundSummary count={funds.length} categoryName={category} />
            <CategoryPageFundList funds={funds} />
            
            {/* FAQ Section */}
            <CategoryPageFAQ 
              categoryName={category} 
              categorySlug={categorySlug || ''} 
              fundsCount={funds.length} 
            />
            
            <RelatedCategories allCategories={allCategories} currentCategory={category} />
            
            {/* Premium CTA at bottom of category page */}
            <div className="mt-10 sm:mt-12">
              <PremiumCTA variant="full" location={`category-bottom-${categorySlug}`} />
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
