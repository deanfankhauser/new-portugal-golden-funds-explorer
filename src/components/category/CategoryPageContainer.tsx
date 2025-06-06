
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFundsByCategory, getAllCategories } from '../../data/funds';
import { slugToCategory } from '@/lib/utils';
import CategoryPageContent from './CategoryPageContent';

const CategoryPageContainer = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  // Convert URL slug to actual category
  const category = categorySlug ? slugToCategory(categorySlug) : '';
  const allCategories = getAllCategories();
  
  // Check if the category exists
  const categoryExists = allCategories.includes(category as any);
  const funds = categoryExists ? getFundsByCategory(category as any) : [];

  useEffect(() => {
    if (!categoryExists) {
      // If category doesn't exist, redirect to homepage
      navigate('/');
      return;
    }
  }, [categoryExists, navigate]);

  if (!categoryExists) return null;

  return (
    <CategoryPageContent 
      category={category}
      categorySlug={categorySlug || ''}
      funds={funds}
      allCategories={allCategories}
      navigate={navigate}
    />
  );
};

export default CategoryPageContainer;
