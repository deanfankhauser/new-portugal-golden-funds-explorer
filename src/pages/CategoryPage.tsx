
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
  
  console.log('🔥 CategoryPage: ===== PROCESSING CATEGORY PAGE =====');
  console.log('🔥 CategoryPage: URL slug received:', categorySlug);
  console.log('🔥 CategoryPage: Current URL:', window.location.href);
  console.log('🔥 CategoryPage: Pathname:', window.location.pathname);
  
  const allCategories = getAllCategories();
  console.log('🔥 CategoryPage: All available categories:', allCategories);
  
  // Enhanced category matching logic with multiple fallback strategies
  let matchingCategory: string | undefined;
  let displayCategoryName = '';
  
  if (categorySlug) {
    // Strategy 1: Exact slug match
    matchingCategory = allCategories.find(cat => {
      const catSlug = categoryToSlug(cat);
      console.log(`🔥 CategoryPage: Comparing "${catSlug}" with "${categorySlug}"`);
      return catSlug === categorySlug;
    });
    
    // Strategy 2: If no exact match, try converting slug back and finding partial matches
    if (!matchingCategory) {
      const convertedCategoryName = slugToCategory(categorySlug);
      console.log('🔥 CategoryPage: No exact match, trying converted name:', convertedCategoryName);
      
      // Look for categories that contain the converted name or vice versa
      matchingCategory = allCategories.find(cat => {
        const catLower = cat.toLowerCase();
        const convertedLower = convertedCategoryName.toLowerCase();
        return catLower.includes(convertedLower) || convertedLower.includes(catLower);
      });
      
      if (matchingCategory) {
        console.log('🔥 CategoryPage: Found partial match:', matchingCategory);
      }
    }
    
    // Strategy 3: Try handling categories with special characters or complex names
    if (!matchingCategory) {
      const normalizedSlug = categorySlug.replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
      const convertedNormalized = slugToCategory(normalizedSlug);
      console.log('🔥 CategoryPage: Trying normalized conversion:', convertedNormalized);
      
      matchingCategory = allCategories.find(cat => {
        const catNormalized = cat.toLowerCase().replace(/[^\w\s]/g, '').trim();
        const convertedNormalized = convertedNormalized.toLowerCase().replace(/[^\w\s]/g, '').trim();
        return catNormalized === convertedNormalized;
      });
    }
    
    // Set display name
    if (matchingCategory) {
      displayCategoryName = matchingCategory;
    } else {
      displayCategoryName = slugToCategory(categorySlug);
    }
  }
  
  console.log('🔥 CategoryPage: Matching category found:', matchingCategory);
  
  const categoryExists = !!matchingCategory;
  const funds = categoryExists ? getFundsByCategory(matchingCategory as FundCategory) : [];
  
  console.log('🔥 CategoryPage: Final results:', {
    categoryExists,
    fundsCount: funds.length,
    displayCategoryName,
    willUseSEO: displayCategoryName
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorySlug]);

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
