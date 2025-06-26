
import React, { useState, useMemo } from 'react';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody } from '../ui/table';
import AdvancedFilters, { FilterOptions } from './AdvancedFilters';
import TablePagination from './TablePagination';
import FundIndexMobileCard from './FundIndexMobileCard';
import FundIndexTableRow from './FundIndexTableRow';
import FundIndexTableHeader from './FundIndexTableHeader';
import FundIndexControls from './FundIndexControls';

interface FullIndexTableProps {
  scores: FundScore[];
}

type SortField = 'rank' | 'name' | 'score' | 'performance' | 'fees' | 'minInvestment';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

const FullIndexTable: React.FC<FullIndexTableProps> = ({ scores }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
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
      
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || (
        fund.name.toLowerCase().includes(searchLower) ||
        fund.managerName.toLowerCase().includes(searchLower) ||
        fund.category.toLowerCase().includes(searchLower)
      );

      // Advanced filters
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

    // Sorting
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
          valueA = a.movingtoScore;
          valueB = b.movingtoScore;
          break;
        case 'performance':
          valueA = a.performanceScore;
          valueB = b.performanceScore;
          break;
        case 'fees':
          valueA = fundA.managementFee;
          valueB = fundB.managementFee;
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
  }, [scores, searchTerm, sortField, sortDirection, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedScores.length / ITEMS_PER_PAGE);
  const paginatedScores = filteredAndSortedScores.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      fundStatus: 'all',
      minInvestmentRange: 'all',
      managementFeeRange: 'all'
    });
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <Card id="full-index">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Complete Fund Index
        </CardTitle>
        <div className="space-y-4">
          <FundIndexControls
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            filteredScores={filteredAndSortedScores}
          />
          
          <AdvancedFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
          />
          
          <div className="text-sm text-gray-500">
            Showing {paginatedScores.length} of {filteredAndSortedScores.length} funds 
            ({scores.length} total)
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <FundIndexTableHeader
              sortField={sortField}
              onSort={handleSort}
            />
            <TableBody>
              {paginatedScores.map((score) => (
                <FundIndexTableRow key={score.fundId} score={score} />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {paginatedScores.map((score) => (
            <FundIndexMobileCard key={score.fundId} score={score} />
          ))}
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredAndSortedScores.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </CardContent>
    </Card>
  );
};

export default FullIndexTable;
