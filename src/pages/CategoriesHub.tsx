
import React, { useEffect } from 'react';
import { getAllCategories } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import CategoriesHubBreadcrumbs from '../components/categories-hub/CategoriesHubBreadcrumbs';
import CategoriesHubHeader from '../components/categories-hub/CategoriesHubHeader';
import CategoriesList from '../components/categories-hub/CategoriesList';

const CategoriesHub = () => {
  const allCategories = getAllCategories();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

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
