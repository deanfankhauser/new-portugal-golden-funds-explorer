
import { useState, useMemo } from 'react';
import { Fund, FundTag, funds, searchFunds } from '../data/funds';

export const useFundFiltering = () => {
  const [selectedTags, setSelectedTags] = useState<FundTag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFunds = useMemo(() => {
    let result = [...funds];
    
    // Apply tag filtering
    if (selectedTags.length > 0) {
      result = result.filter(fund => 
        selectedTags.every(tag => fund.tags.includes(tag))
      );
    }
    
    // Apply search
    if (searchQuery) {
      result = searchFunds(searchQuery);
    }
    
    return result;
  }, [selectedTags, searchQuery]);

  return {
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    filteredFunds
  };
};
