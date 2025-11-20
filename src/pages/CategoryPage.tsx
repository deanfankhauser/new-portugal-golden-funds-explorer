
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFundsByCategory } from '../data/services/categories-service';
import { getAllCategories } from '../data/services/categories-service';
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
import VerificationFilterChip from '../components/common/VerificationFilterChip';
import { FloatingActionButton } from '../components/common/FloatingActionButton';
import { useAllFunds } from '../hooks/useFundsQuery';
import FundListSkeleton from '../components/common/FundListSkeleton';

const CategoryPage = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { data: allFundsData, isLoading } = useAllFunds();
  
  const allDatabaseFunds = allFundsData || [];
  
  // Convert URL slug to actual category
  const category = categorySlug ? slugToCategory(categorySlug) : '';
  const allCategories = getAllCategories(allDatabaseFunds);
  
  // Check if the category exists
  const categoryExists = allCategories.includes(category as any);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect after component has mounted and data has loaded
    if (hasMounted && !isLoading && !categoryExists && categorySlug) {
      // If category doesn't exist, redirect to homepage
      navigate('/');
      return;
    }
    
    // Scroll to top when category changes
    if (categoryExists) {
      window.scrollTo(0, 0);
    }
  }, [hasMounted, categoryExists, navigate, categorySlug, isLoading]);

  // Show loading state
  if (isLoading) {
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

  // Don't render anything if category doesn't exist
  if (!categoryExists || !category) {
    return null;
  }

  const allFunds = getFundsByCategory(allDatabaseFunds, category as any);
  
  // Filter funds by verification status
  const funds = useMemo(() => {
    if (!showOnlyVerified) return allFunds;
    return allFunds.filter(fund => fund.isVerified);
  }, [allFunds, showOnlyVerified]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="category" categoryName={category} funds={funds} />
      <Header />
      
      <main className="flex-1 py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <CategoryBreadcrumbs categoryName={category} />
          
          <CategoryPageHeader categoryName={category} />
          
          {/* Link to Main Hub */}
          <div className="mb-6 text-center">
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
            <p className="text-sm text-muted-foreground mt-2">
              <a 
                href="https://movingto.com/pt/portugal-golden-visa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 underline"
              >
                Learn more about Golden Visa requirements
              </a>
            </p>
          </div>
          
          {/* Verification Filter */}
          <div className="mb-6">
            <VerificationFilterChip 
              showOnlyVerified={showOnlyVerified}
              setShowOnlyVerified={setShowOnlyVerified}
            />
          </div>
          
          {funds.length === 0 && !showOnlyVerified ? (
            <CategoryPageEmptyState categoryName={category} />
          ) : funds.length === 0 && showOnlyVerified && allFunds.length > 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No verified funds found in the "{category}" category.
              </p>
              <p className="text-muted-foreground mt-2">
                Try disabling the verification filter to see all {allFunds.length} funds.
              </p>
            </div>
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
      
      <FloatingActionButton />
    </div>
  );
};

export default CategoryPage;
