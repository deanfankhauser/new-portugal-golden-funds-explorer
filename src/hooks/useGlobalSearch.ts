import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { getAllCategories } from '@/data/services/categories-service';
import { getAllFundManagers } from '@/data/services/managers-service';
import { getAllTags } from '@/data/services/tags-service';
import { useRealTimeFunds } from './useRealTimeFunds';

export interface SearchResult {
  type: 'fund' | 'category' | 'manager' | 'tag';
  id: string;
  name: string;
  subtitle?: string;
  url: string;
  metadata?: any;
}

export const useGlobalSearch = (query: string) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { funds } = useRealTimeFunds();

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    const searchTerm = debouncedQuery.toLowerCase();
    
    // Search funds
    const matchingFunds = funds
      .filter(fund => 
        fund.name.toLowerCase().includes(searchTerm) ||
        fund.description.toLowerCase().includes(searchTerm) ||
        fund.managerName.toLowerCase().includes(searchTerm)
      )
      .slice(0, 5)
      .map(fund => ({
        type: 'fund' as const,
        id: fund.id,
        name: fund.name,
        subtitle: fund.managerName,
        url: `/${fund.id}`,
        metadata: {
          category: fund.category,
          returnTarget: fund.returnTarget,
          isVerified: fund.isVerified
        }
      }));

    // Search categories
    const categories = getAllCategories();
    const matchingCategories = categories
      .filter(cat => cat.toLowerCase().includes(searchTerm))
      .slice(0, 3)
      .map(cat => ({
        type: 'category' as const,
        id: cat,
        name: cat,
        url: `/category/${cat.toLowerCase().replace(/\s+/g, '-')}`,
      }));

    // Search managers
    const managers = getAllFundManagers();
    const matchingManagers = managers
      .filter(mgr => mgr.name.toLowerCase().includes(searchTerm))
      .slice(0, 3)
      .map(mgr => ({
        type: 'manager' as const,
        id: mgr.name,
        name: mgr.name,
        subtitle: `${mgr.fundsCount} fund${mgr.fundsCount !== 1 ? 's' : ''}`,
        url: `/manager/${mgr.name.toLowerCase().replace(/\s+/g, '-')}`,
      }));

    // Search tags
    const allTags = getAllTags();
    const matchingTags = allTags
      .filter(tag => tag.toLowerCase().includes(searchTerm))
      .slice(0, 3)
      .map(tag => ({
        type: 'tag' as const,
        id: tag,
        name: tag,
        url: `/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`,
      }));

    setResults([...matchingFunds, ...matchingCategories, ...matchingManagers, ...matchingTags]);
    setIsSearching(false);
  }, [debouncedQuery, funds]);

  return { results, isSearching };
};
