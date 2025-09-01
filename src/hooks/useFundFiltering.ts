
import { useState, useMemo } from 'react';
import { Fund, FundTag, funds, searchFunds } from '../data/funds';
import { getGVEligibleFunds } from '../data/services/gv-eligibility-service';

export const useFundFiltering = () => {
  const [selectedTags, setSelectedTags] = useState<FundTag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyGVEligible, setShowOnlyGVEligible] = useState(true); // Default to GV eligible only

  const filteredFunds = useMemo(() => {
    let result = [...funds];
    
    // Apply GV eligibility filter first (default behavior)
    if (showOnlyGVEligible) {
      result = getGVEligibleFunds(result);
    }
    
    // Apply tag filtering
    if (selectedTags.length > 0) {
      result = result.filter(fund => 
        selectedTags.every(tag => fund.tags.includes(tag))
      );
    }
    
    // Apply search filtering to the already filtered results
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(fund => 
        fund.name.toLowerCase().includes(lowerCaseQuery) ||
        fund.description.toLowerCase().includes(lowerCaseQuery) ||
        fund.managerName.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    return result;
  }, [selectedTags, searchQuery, showOnlyGVEligible]);

  return {
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    filteredFunds,
    showOnlyGVEligible,
    setShowOnlyGVEligible
  };
};
