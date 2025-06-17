
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFundsByCategory, getAllCategories } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import CategoryBreadcrumbs from '../components/category/CategoryBreadcrumbs';
import CategoryPageHeader from '../components/category/CategoryPageHeader';
import CategoryPageFundSummary from '../components/category/CategoryPageFundSummary';
import CategoryPageFundList from '../components/category/CategoryPageFundList';
import CategoryPageEmptyState from '../components/category/CategoryPageEmptyState';
import CategoryPageFAQ from '../components/category/CategoryPageFAQ';
import RelatedCategories from '../components/category/RelatedCategories';
import { FundCategory } from '../data/types/funds';
import { slugToCategory, categoryToSlug } from '../lib/utils';

const CategoryPage = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const categoryName = categorySlug ? slugToCategory(categorySlug) : '';
  const allCategories = getAllCategories();
  
  // Find matching category by checking if any category matches when converted to slug
  const matchingCategory = allCategories.find(cat => 
    categoryToSlug(cat) === categorySlug
  );
  
  const categoryExists = !!matchingCategory;
  const funds = categoryExists ? getFundsByCategory(matchingCategory as FundCategory) : [];
  const displayCategoryName = matchingCategory || categoryName;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorySlug]);

  if (!categoryExists) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-4">The category you're looking for doesn't exist.</p>
            <p className="text-sm text-gray-500 mb-4">Available categories:</p>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {allCategories.slice(0, 5).map(cat => (
                <span key={cat} className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="category" categoryName={displayCategoryName} />
      
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1" itemScope itemType="https://schema.org/CollectionPage">
        <CategoryBreadcrumbs categoryName={displayCategoryName} />
        <CategoryPageHeader categoryName={displayCategoryName} />
        
        {funds.length > 0 ? (
          <>
            <CategoryPageFundSummary count={funds.length} categoryName={displayCategoryName} />
            <CategoryPageFundList funds={funds} />
          </>
        ) : (
          <CategoryPageEmptyState categoryName={displayCategoryName} />
        )}
        
        <CategoryPageFAQ categoryName={displayCategoryName} categorySlug={categorySlug || ''} fundsCount={funds.length} />
        <RelatedCategories allCategories={allCategories} currentCategory={displayCategoryName} />
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
