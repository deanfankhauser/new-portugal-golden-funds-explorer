
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
  
  // Validate category exists
  const categoryExists = allCategories.includes(categoryName as FundCategory);
  const funds = categoryExists ? getFundsByCategory(categoryName as FundCategory) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorySlug]);

  if (!categoryExists) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600">The category you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="category" categoryName={categoryName} />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1" itemScope itemType="https://schema.org/CollectionPage">
        <CategoryBreadcrumbs categoryName={categoryName} />
        <CategoryPageHeader categoryName={categoryName} />
        
        {funds.length > 0 ? (
          <>
            <CategoryPageFundSummary count={funds.length} categoryName={categoryName} />
            <CategoryPageFundList funds={funds} />
          </>
        ) : (
          <CategoryPageEmptyState categoryName={categoryName} />
        )}
        
        <CategoryPageFAQ categoryName={categoryName} categorySlug={categorySlug || ''} fundsCount={funds.length} />
        <RelatedCategories allCategories={allCategories} currentCategory={categoryName} />
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
