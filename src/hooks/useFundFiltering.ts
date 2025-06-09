
import { useState, useMemo } from 'react';
import { Fund, FundTag, funds, searchFunds } from '../data/funds';
import { useDebounce } from './useDebounce';

export const useFundFiltering = () => {
  const [selectedTags, setSelectedTags] = useState<FundTag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search query by 300ms to prevent excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredFunds = useMemo(() => {
    setIsLoading(true);
    
    let result = [...funds];
    
    // Apply tag filtering
    if (selectedTags.length > 0) {
      result = result.filter(fund => 
        selectedTags.every(tag => fund.tags.includes(tag))
      );
    }
    
    // Apply search with debounced query
    if (debouncedSearchQuery) {
      result = searchFunds(debouncedSearchQuery);
    }
    
    setIsLoading(false);
    return result;
  }, [selectedTags, debouncedSearchQuery]);

  return {
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    filteredFunds,
    isLoading: isLoading || (searchQuery !== debouncedSearchQuery)
  };
};
