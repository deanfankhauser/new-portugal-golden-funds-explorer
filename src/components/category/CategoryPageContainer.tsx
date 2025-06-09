
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFundsByCategory, getAllCategories } from '../../data/funds';
import { slugToCategory } from '@/lib/utils';

const CategoryPageContainer = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  // Convert URL slug to actual category
  const category = categorySlug ? slugToCategory(categorySlug) : '';
  const allCategories = getAllCategories();
  
  // Check if the category exists
  const categoryExists = allCategories.includes(category as any);

  useEffect(() => {
    if (!categoryExists) {
      // If category doesn't exist, redirect to homepage
      navigate('/');
      return;
    }
  }, [categoryExists, navigate]);

  // This component is no longer needed since we moved everything to CategoryPage
  // Just redirect to maintain compatibility
  if (!categoryExists) return null;
  
  return null;
};

export default CategoryPageContainer;
