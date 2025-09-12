
import { useState, useMemo } from 'react';
import { FundTag } from '../data/types/funds';
import { useRealTimeFunds } from './useRealTimeFunds';

export const useFundFiltering = () => {
  const [selectedTags, setSelectedTags] = useState<FundTag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { funds, filterFunds, loading, error } = useRealTimeFunds();

  const filteredFunds = useMemo(() => {
    return filterFunds(selectedTags, searchQuery);
  }, [selectedTags, searchQuery, filterFunds]);

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
