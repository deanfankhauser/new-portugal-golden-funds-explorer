
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFundsByCategory, getAllCategories } from '../data/funds';
import { slugToCategory, categoryToSlug } from '@/lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import CategoryPageHeader from '../components/category/CategoryPageHeader';
import CategoryBreadcrumbs from '../components/category/CategoryBreadcrumbs';
import CategoryPageFundList from '../components/category/CategoryPageFundList';
import CategoryPageFundSummary from '../components/category/CategoryPageFundSummary';
import CategoryPageFAQ from '../components/category/CategoryPageFAQ';
import CategoryPageEmptyState from '../components/category/CategoryPageEmptyState';
import RelatedCategories from '../components/category/RelatedCategories';
import CategoryCrossLinks from '../components/category/CategoryCrossLinks';

const CategoryPage = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  // Convert URL slug to actual category
  const category = categorySlug ? slugToCategory(categorySlug) : '';
  const allCategories = getAllCategories();
  
  // Check if the category exists
  const categoryExists = allCategories.includes(category as any);

  useEffect(() => {
    if (!categoryExists && categorySlug) {
      // If category doesn't exist, redirect to homepage
      navigate('/');
      return;
    }
    
    // Scroll to top when category changes
    window.scrollTo(0, 0);
  }, [categoryExists, navigate, categorySlug]);

  // Don't render anything if category doesn't exist
  if (!categoryExists || !category) {
    return null;
  }

  const funds = getFundsByCategory(category as any);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="category" categoryName={category} funds={funds} />
      <Header />
      
      <main className="flex-1 py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <CategoryBreadcrumbs categoryName={category} />
          
          <CategoryPageHeader categoryName={category} />
          
          {funds.length === 0 ? (
            <CategoryPageEmptyState categoryName={category} />
          ) : (
            <div className="space-y-8">
              <CategoryPageFundSummary count={funds.length} categoryName={category} />
              
              <CategoryPageFundList funds={funds} />
              
              <CategoryCrossLinks categoryName={category} />
              
              <CategoryPageFAQ 
                categoryName={category} 
                categorySlug={categorySlug || ''} 
                fundsCount={funds.length} 
              />
              
              <RelatedCategories allCategories={allCategories} currentCategory={category} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
