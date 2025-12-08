
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FundTag, FundCategory, Fund } from '../data/types/funds';
import { useAllFunds } from './useFundsQuery';

export const useFundFiltering = () => {
  const [searchParams] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<FundTag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FundCategory | null>(null);
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const { data: funds, isLoading, isError, isFetching } = useAllFunds();

  // Get filters from URL params
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category');
  const riskParam = searchParams.get('risk');
  const tagParam = searchParams.get('tag');
  const verifiedParam = searchParams.get('verified') === 'true';

  const filteredFunds = useMemo(() => {
    // Return empty array while loading or on error
    if (!funds || funds.length === 0) {
      return [];
    }

    // Apply tag filter (search query and tags)
    let result = funds.filter(fund => {
      // Search query filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          fund.name.toLowerCase().includes(searchLower) ||
          fund.managerName.toLowerCase().includes(searchLower) ||
          fund.category.toLowerCase().includes(searchLower) ||
          fund.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Tag filter (from selectedTags state or URL param)
      const tagsToFilter = selectedTags.length > 0 ? selectedTags : (tagParam ? [tagParam] : []);
      if (tagsToFilter.length > 0) {
        const fundTagsLower = fund.tags.map(t => t.toLowerCase());
        const hasAllTags = tagsToFilter.every(selectedTag => 
          fundTagsLower.includes(selectedTag.toLowerCase())
        );
        if (!hasAllTags) return false;
      }

      // Risk filter from URL param
      if (riskParam) {
        const riskLower = riskParam.toLowerCase();
        const matchesRisk = fund.tags.some(tag => tag.toLowerCase().includes(riskLower));
        if (!matchesRisk) return false;
      }

      return true;
    });
    
    // Apply category filter (from selectedCategory state or URL param)
    const categoryToFilter = selectedCategory || categoryParam;
    if (categoryToFilter) {
      result = result.filter(fund => fund.category === categoryToFilter);
    }
    
    // Apply manager filter
    if (selectedManager) {
      result = result.filter(fund => 
        fund.managerName.toLowerCase() === selectedManager.toLowerCase()
      );
    }
    
    // Apply verified filter (from showOnlyVerified state or URL param)
    if (showOnlyVerified || verifiedParam) {
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
    
    return sorted;
  }, [selectedTags, selectedCategory, selectedManager, searchQuery, showOnlyVerified, funds, categoryParam, riskParam, tagParam, verifiedParam]);

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
    allFunds: funds || [],
    loading: isLoading && !Array.isArray(funds),
    error: isError ? 'Failed to load funds' : undefined
  };
};
