
import { useState, useMemo } from 'react';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { ContentGatingService } from '../../services/contentGatingService';

export type SortField = 'rank' | 'name' | 'score' | 'performance' | 'fees' | 'minInvestment';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
  category: string;
  fundStatus: string;
  minInvestmentRange: string;
  managementFeeRange: string;
}

export const useFilterAndSort = (scores: FundScore[], isAuthenticated: boolean = false) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    fundStatus: 'all',
    minInvestmentRange: 'all',
    managementFeeRange: 'all'
  });

  const filteredAndSortedScores = useMemo(() => {
    let filtered = scores.filter(score => {
      const fund = getFundById(score.fundId);
      if (!fund) return false;
      
      // Search filter (always available)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || (
        fund.name.toLowerCase().includes(searchLower) ||
        fund.managerName.toLowerCase().includes(searchLower) ||
        fund.category.toLowerCase().includes(searchLower)
      );

      // Advanced filters - only apply if authenticated
      if (!isAuthenticated) {
        return matchesSearch;
      }

      const matchesCategory = filters.category === 'all' || fund.category === filters.category;
      const matchesStatus = filters.fundStatus === 'all' || fund.fundStatus === filters.fundStatus;
      
      const matchesInvestment = filters.minInvestmentRange === 'all' || (() => {
        switch (filters.minInvestmentRange) {
          case '0-250000': return fund.minimumInvestment <= 250000;
          case '250000-350000': return fund.minimumInvestment > 250000 && fund.minimumInvestment <= 350000;
          case '350000-500000': return fund.minimumInvestment > 350000 && fund.minimumInvestment <= 500000;
          case '500000+': return fund.minimumInvestment > 500000;
          default: return true;
        }
      })();

      const matchesFee = filters.managementFeeRange === 'all' || (() => {
        switch (filters.managementFeeRange) {
          case '0-1': return fund.managementFee <= 1;
          case '1-1.5': return fund.managementFee > 1 && fund.managementFee <= 1.5;
          case '1.5-2': return fund.managementFee > 1.5 && fund.managementFee <= 2;
          case '2+': return fund.managementFee > 2;
          default: return true;
        }
      })();

      return matchesSearch && matchesCategory && matchesStatus && matchesInvestment && matchesFee;
    });

    // Sorting - restrict some fields for non-authenticated users
    filtered.sort((a, b) => {
      const fundA = getFundById(a.fundId);
      const fundB = getFundById(b.fundId);
      if (!fundA || !fundB) return 0;

      let valueA: any, valueB: any;
      
      switch (sortField) {
        case 'rank':
          valueA = a.rank;
          valueB = b.rank;
          break;
        case 'name':
          valueA = fundA.name;
          valueB = fundB.name;
          break;
        case 'score':
          // Gate detailed scoring for non-authenticated users
          if (!isAuthenticated) {
            valueA = a.rank;
            valueB = b.rank;
          } else {
            valueA = a.movingtoScore;
            valueB = b.movingtoScore;
          }
          break;
        case 'performance':
          // Gate performance metrics for non-authenticated users
          if (!isAuthenticated) {
            valueA = a.rank;
            valueB = b.rank;
          } else {
            valueA = a.performanceScore;
            valueB = b.performanceScore;
          }
          break;
        case 'fees':
          // Gate fee-based sorting for non-authenticated users
          if (!isAuthenticated) {
            valueA = fundA.minimumInvestment;
            valueB = fundB.minimumInvestment;
          } else {
            valueA = fundA.managementFee;
            valueB = fundB.managementFee;
          }
          break;
        case 'minInvestment':
          valueA = fundA.minimumInvestment;
          valueB = fundB.minimumInvestment;
          break;
        default:
          valueA = a.rank;
          valueB = b.rank;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortDirection === 'asc' 
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    });

    return filtered;
  }, [scores, searchTerm, sortField, sortDirection, filters, isAuthenticated]);

  const handleSort = (field: SortField) => {
    // Restrict certain sorting for non-authenticated users
    if (!isAuthenticated && ['score', 'performance', 'fees'].includes(field)) {
      return; // Could trigger auth dialog here if needed
    }

    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    if (!isAuthenticated) {
      return; // Filters are gated in the component
    }
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    if (!isAuthenticated) {
      return; // Filters are gated in the component
    }
    setFilters({
      category: 'all',
      fundStatus: 'all',
      minInvestmentRange: 'all',
      managementFeeRange: 'all'
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    filters,
    filteredAndSortedScores,
    handleSort,
    handleFiltersChange,
    handleClearFilters
  };
};
