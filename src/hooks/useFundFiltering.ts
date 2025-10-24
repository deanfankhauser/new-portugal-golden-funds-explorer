
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FundTag, FundCategory } from '../data/types/funds';
import { useRealTimeFunds } from './useRealTimeFunds';

export const useFundFiltering = () => {
  const [searchParams] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<FundTag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FundCategory | null>(null);
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const { funds, filterFunds, loading, error } = useRealTimeFunds();

  // Get search query from URL params
  const searchQuery = searchParams.get('search') || '';

  const filteredFunds = useMemo(() => {
    let result = filterFunds(selectedTags, searchQuery);
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(fund => fund.category === selectedCategory);
    }
    
    // Apply manager filter
    if (selectedManager) {
      result = result.filter(fund => 
        fund.managerName.toLowerCase() === selectedManager.toLowerCase()
      );
    }
    
    // Apply verified filter
    if (showOnlyVerified) {
      result = result.filter(fund => fund.isVerified === true);
    }
    
    // Sort by: 1. Verified status (verified first), 2. finalRank
    const sorted = [...result].sort((a, b) => {
      // Verified funds always at the top
      if (a.isVerified && !b.isVerified) return -1;
      if (!a.isVerified && b.isVerified) return 1;
      
      // Then by admin ranking
      return (a.finalRank ?? 999) - (b.finalRank ?? 999);
    });
    
    console.log('🔍 Filtering debug:', {
      totalFunds: funds.length,
      selectedTags,
      selectedCategory,
      selectedManager,
      searchQuery,
      filteredCount: result.length,
      loading,
      error
    });
    return sorted;
  }, [selectedTags, selectedCategory, selectedManager, searchQuery, filterFunds, funds.length, loading, error]);

  return {
    selectedTags,
    setSelectedTags,
    selectedCategory,
    setSelectedCategory,
    selectedManager,
    setSelectedManager,
    showOnlyVerified,
    setShowOnlyVerified,
    searchQuery,
    filteredFunds,
    allFunds: funds,
    loading,
    error
  };
};
