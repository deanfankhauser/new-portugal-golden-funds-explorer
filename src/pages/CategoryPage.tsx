
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFundsByCategory } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import CategoryPageContainer from '../components/category/CategoryPageContainer';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const categoryName = category?.replace(/-/g, ' ') || '';
  const funds = getFundsByCategory(categoryName);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="category" categoryName={categoryName} />
      
      <Header />
      
      <CategoryPageContainer 
        categoryName={categoryName}
        funds={funds}
      />
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
