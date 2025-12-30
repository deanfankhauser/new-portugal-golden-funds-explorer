
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';
import { getFundsByCategory } from '../data/services/categories-service';
import { getAllCategories } from '../data/services/categories-service';
import { FundCategory } from '../data/types/funds';
import { slugToCategory, categoryToSlug } from '@/lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import CategorySnapshotHero from '../components/category/CategorySnapshotHero';
import CategoryEditorialBlock from '../components/category/CategoryEditorialBlock';
import CategoryBreadcrumbs from '../components/category/CategoryBreadcrumbs';
import CategoryPageFundList from '../components/category/CategoryPageFundList';
import CategoryPageFundSummary from '../components/category/CategoryPageFundSummary';
import CategoryPageFAQ from '../components/category/CategoryPageFAQ';
import CategoryPageEmptyState from '../components/category/CategoryPageEmptyState';
import RelatedCategories from '../components/category/RelatedCategories';
import CategoryCrossLinks from '../components/category/CategoryCrossLinks';
import VerificationFilterChip from '../components/common/VerificationFilterChip';
import { FloatingActionButton } from '../components/common/FloatingActionButton';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import FundListSkeleton from '../components/common/FundListSkeleton';
import { Fund } from '../data/types/funds';

interface CategoryPageProps {
  categoryData?: {
    categoryName: string;
    categorySlug: string;
    funds: Fund[];
  };
  initialFunds?: Fund[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryData: ssrData, initialFunds }) => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  
  // Use SSR data if available, otherwise fetch from hook
  const { funds: allFundsData, loading: isLoading } = useRealTimeFunds({
    initialData: initialFunds || (ssrData ? ssrData.funds : undefined)
  });
  const allDatabaseFunds = ssrData ? ssrData.funds : (allFundsData || []);
  
  // Convert URL slug to actual category
  const category = categorySlug ? slugToCategory(categorySlug) : '';
  const allCategories = getAllCategories(allDatabaseFunds);
  
  // Enhanced category matching with multiple strategies
  let matchingCategory: string | null = null;
  
  if (category && allDatabaseFunds.length > 0) {
    // Strategy 1: Exact match
    matchingCategory = allCategories.find(cat => cat === category) || null;
    
    // Strategy 2: Case-insensitive match
    if (!matchingCategory) {
      matchingCategory = allCategories.find(cat => 
        cat.toLowerCase() === category.toLowerCase()
      ) || null;
    }
    
    // Strategy 3: Slug-based matching
    if (!matchingCategory && categorySlug) {
      matchingCategory = allCategories.find(cat => 
        categoryToSlug(cat) === categorySlug
      ) || null;
    }
  }
  
  const categoryExists = !!matchingCategory;
  const displayCategoryName = matchingCategory || category;

  // ✅ ALL HOOKS MUST BE CALLED BEFORE EARLY RETURNS (React Rules of Hooks)
  const allFunds = useMemo(() => {
    return matchingCategory 
      ? getFundsByCategory(allDatabaseFunds, matchingCategory as FundCategory) 
      : [];
  }, [allDatabaseFunds, matchingCategory]);
  
  // Filter funds by verification status
  const funds = useMemo(() => {
    if (!showOnlyVerified) return allFunds;
    return allFunds.filter(fund => fund.isVerified);
  }, [allFunds, showOnlyVerified]);

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorySlug]);

  // Show loading state only when no initial data provided
  if (isLoading && !initialFunds && !ssrData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-6 md:py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <FundListSkeleton count={6} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show 404 for non-existent categories
  if (!categoryExists && category) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="category" categoryName={displayCategoryName} funds={funds} />
      <Header />
      
      <main className="flex-1 py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <CategoryBreadcrumbs categoryName={displayCategoryName} />
          
          <CategorySnapshotHero categoryName={displayCategoryName} funds={allFunds} />
          
          <CategoryEditorialBlock categoryName={displayCategoryName} />
          
          
          {/* Verification Filter */}
          <div className="mb-6">
            <VerificationFilterChip 
              showOnlyVerified={showOnlyVerified}
              setShowOnlyVerified={setShowOnlyVerified}
            />
          </div>
          
          {funds.length === 0 && !showOnlyVerified ? (
            <CategoryPageEmptyState categoryName={displayCategoryName} allCategories={allCategories} />
          ) : funds.length === 0 && showOnlyVerified && allFunds.length > 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No verified funds found in the "{displayCategoryName}" category.
              </p>
              <p className="text-muted-foreground mt-2">
                Try disabling the verification filter to see all {allFunds.length} funds.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <CategoryPageFundSummary count={funds.length} categoryName={displayCategoryName} />
              
              <CategoryPageFundList funds={funds} />
              
              <CategoryCrossLinks categoryName={displayCategoryName} />
              
              <CategoryPageFAQ 
                categoryName={displayCategoryName} 
                categorySlug={categorySlug || ''} 
                fundsCount={allFunds.length}
                funds={allFunds}
              />
              
              <RelatedCategories allCategories={allCategories} currentCategory={displayCategoryName} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      <FloatingActionButton />
    </div>
  );
};

export default CategoryPage;
