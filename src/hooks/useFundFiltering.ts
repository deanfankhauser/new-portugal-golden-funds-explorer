
import { useState, useMemo } from 'react';
import { FundTag } from '../data/types/funds';
import { useRealTimeFunds } from './useRealTimeFunds';

export const useFundFiltering = () => {
  const [selectedTags, setSelectedTags] = useState<FundTag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { funds, filterFunds, loading, error } = useRealTimeFunds();

  const filteredFunds = useMemo(() => {
    const result = filterFunds(selectedTags, searchQuery);
    console.log('🔍 Filtering debug:', {
      totalFunds: funds.length,
      selectedTags,
      searchQuery,
      filteredCount: result.length,
      loading,
      error
    });
    return result;
  }, [selectedTags, searchQuery, filterFunds, funds.length, loading, error]);

  return {
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    filteredFunds,
    allFunds: funds,
    loading,
    error
  };
};
