
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFundsByCategory } from '../../data/services/categories-service';
import { getAllCategories } from '../../data/services/categories-service';
import { slugToCategory } from '@/lib/utils';
import { useAllFunds } from '../../hooks/useFundsQuery';

const CategoryPageContainer = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { data: allFundsData } = useAllFunds();
  const allDatabaseFunds = allFundsData || [];
  
  // Convert URL slug to actual category
  const category = categorySlug ? slugToCategory(categorySlug) : '';
  const allCategories = getAllCategories(allDatabaseFunds);
  
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
