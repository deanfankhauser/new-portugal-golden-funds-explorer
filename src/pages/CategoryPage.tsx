
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
  
  console.log('🔥 CategoryPage: Processing category slug:', categorySlug);
  const allCategories = getAllCategories();
  console.log('🔥 CategoryPage: All available categories:', allCategories);
  
  // Enhanced matching logic with multiple strategies
  let matchingCategory: string | null = null;
  let displayCategoryName = '';
  
  if (categorySlug) {
    // Strategy 1: Exact slug match
    matchingCategory = allCategories.find(cat => categoryToSlug(cat) === categorySlug) || null;
    console.log('🔥 CategoryPage: Exact slug match result:', matchingCategory);
    
    // Strategy 2: Handle double-dash cases for "&" separators
    if (!matchingCategory && categorySlug.includes('--')) {
      // Convert slug back to category with proper & handling
      const convertedCategory = slugToCategory(categorySlug);
      matchingCategory = allCategories.find(cat => 
        cat.toLowerCase() === convertedCategory.toLowerCase()
      ) || null;
      console.log('🔥 CategoryPage: Double-dash conversion match result:', matchingCategory);
    }
    
    // Strategy 3: Try alternative conversions for double dashes
    if (!matchingCategory && categorySlug.includes('--')) {
      // Try different & separator patterns
      const alternativeConversions = [
        categorySlug.replace(/--/g, ' & '),
        categorySlug.replace(/--/g, ' and '),
        categorySlug.replace(/--/g, '-'),
      ];
      
      for (const altSlug of alternativeConversions) {
        const converted = altSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        matchingCategory = allCategories.find(cat => 
          cat.toLowerCase() === converted.toLowerCase()
        ) || null;
        if (matchingCategory) {
          console.log('🔥 CategoryPage: Alternative conversion match:', matchingCategory);
          break;
        }
      }
    }
    
    // Strategy 4: Fuzzy matching for partial matches
    if (!matchingCategory) {
      const convertedCategory = slugToCategory(categorySlug);
      matchingCategory = allCategories.find(cat => 
        cat.toLowerCase().includes(convertedCategory.toLowerCase()) ||
        convertedCategory.toLowerCase().includes(cat.toLowerCase())
      ) || null;
      console.log('🔥 CategoryPage: Fuzzy match result:', matchingCategory);
    }
    
    displayCategoryName = matchingCategory || slugToCategory(categorySlug);
    
    console.log('🔥 CategoryPage: Final matching results:', {
      categorySlug,
      matchingCategory,
      displayCategoryName,
      categoryExists: !!matchingCategory
    });
  }
  
  const categoryExists = !!matchingCategory;
  const funds = categoryExists ? getFundsByCategory(matchingCategory as FundCategory) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
    
    console.log('🔥 CategoryPage: Final processing results:', {
      categorySlug,
      matchingCategory,
      displayCategoryName,
      categoryExists,
      fundsCount: funds.length
    });
  }, [categorySlug, matchingCategory, displayCategoryName, categoryExists]);

  if (!categoryExists) {
    console.error('🔥 CategoryPage: ❌ Category not found - will show 404');
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-4">The category you're looking for doesn't exist.</p>
            <p className="text-sm text-gray-500 mb-4">URL slug: {categorySlug}</p>
            <p className="text-sm text-gray-500 mb-4">Available categories:</p>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {allCategories.slice(0, 5).map(cat => (
                <span key={cat} className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {cat} (slug: {categoryToSlug(cat)})
                </span>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  console.log('🔥 CategoryPage: ✅ Rendering category page with SEO for:', displayCategoryName);

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
