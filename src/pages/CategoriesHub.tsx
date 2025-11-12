
import React, { useEffect } from 'react';
import { getAllCategories } from '../data/services/categories-service';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import CategoriesHubBreadcrumbs from '../components/categories-hub/CategoriesHubBreadcrumbs';
import CategoriesHubHeader from '../components/categories-hub/CategoriesHubHeader';
import CategoriesList from '../components/categories-hub/CategoriesList';
import { useAllFunds } from '../hooks/useFundsQuery';
import FundListSkeleton from '../components/common/FundListSkeleton';

const CategoriesHub = () => {
  const { data: allFundsData, isLoading } = useAllFunds();
  const allDatabaseFunds = allFundsData || [];
  const allCategories = getAllCategories(allDatabaseFunds);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-1">
          <FundListSkeleton count={6} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="categories-hub" />

      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1" itemScope itemType="https://schema.org/CollectionPage">
        <CategoriesHubBreadcrumbs />
        <CategoriesHubHeader />
        <CategoriesList categories={allCategories} />
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoriesHub;
