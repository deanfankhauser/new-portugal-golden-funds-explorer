
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FundTag, FundCategory } from '../data/types/funds';
import { useRealTimeFunds } from './useRealTimeFunds';

export const useFundFiltering = () => {
  const [searchParams] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<FundTag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FundCategory | null>(null);
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
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
    
    // Re-sort by finalRank to maintain admin-defined order after filtering
    const sorted = [...result].sort((a, b) => 
      (a.finalRank ?? 999) - (b.finalRank ?? 999)
    );
    
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
    searchQuery,
    filteredFunds,
    allFunds: funds,
    loading,
    error
  };
};
