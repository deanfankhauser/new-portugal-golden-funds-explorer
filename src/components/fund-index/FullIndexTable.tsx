
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpDown, ExternalLink, Download } from 'lucide-react';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import AdvancedFilters, { FilterOptions } from './AdvancedFilters';
import TablePagination from './TablePagination';
import FundIndexMobileCard from './FundIndexMobileCard';

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
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
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

  const handleExportCSV = () => {
    const csvContent = [
      ['Rank', 'Fund Name', 'Manager', 'Movingto Score', 'Performance Score', 'Management Fee', 'Min Investment', 'Category', 'Status'].join(','),
      ...filteredAndSortedScores.map(score => {
        const fund = getFundById(score.fundId);
        if (!fund) return '';
        return [
          score.rank,
          `"${fund.name}"`,
          `"${fund.managerName}"`,
          score.movingtoScore,
          score.performanceScore,
          fund.managementFee,
          fund.minimumInvestment,
          `"${fund.category}"`,
          `"${fund.fundStatus}"`
        ].join(',');
      }).filter(row => row !== '')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fund-index-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead>
      <Button 
        variant="ghost" 
        onClick={() => handleSort(field)}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        {children}
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    </TableHead>
  );

  return (
    <Card id="full-index">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Complete Fund Index
        </CardTitle>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search funds, managers, or categories..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="pl-10"
              />
            </div>
            <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
          
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
            <TableHeader>
              <TableRow>
                <SortableHeader field="rank">Rank</SortableHeader>
                <SortableHeader field="name">Fund Name</SortableHeader>
                <TableHead>Manager</TableHead>
                <SortableHeader field="score">Movingto Score</SortableHeader>
                <SortableHeader field="performance">Performance</SortableHeader>
                <SortableHeader field="fees">Mgmt Fee</SortableHeader>
                <SortableHeader field="minInvestment">Min Investment</SortableHeader>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedScores.map((score) => {
                const fund = getFundById(score.fundId);
                if (!fund) return null;

                return (
                  <TableRow key={fund.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">#{score.rank}</span>
                        {score.rank <= 3 && (
                          <Badge variant="secondary" className="text-xs">
                            Top {score.rank}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{fund.name}</div>
                        <div className="text-sm text-gray-500">{fund.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{fund.managerName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {score.movingtoScore}
                        </div>
                        <div className="text-xs text-gray-500">/ 100</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-semibold">{score.performanceScore}</div>
                        <div className="text-xs text-gray-500">{fund.returnTarget}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center font-semibold">
                        {fund.managementFee}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center font-semibold">
                        €{fund.minimumInvestment.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={fund.fundStatus === 'Open' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {fund.fundStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link to={`/funds/${fund.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
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
