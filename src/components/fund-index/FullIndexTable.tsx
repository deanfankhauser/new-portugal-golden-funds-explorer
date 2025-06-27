
import React, { useState } from 'react';
import { FundScore } from '../../services/fundScoringService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import AdvancedFilters from './AdvancedFilters';
import TablePagination from './TablePagination';
import FundIndexControls from './FundIndexControls';
import FundIndexStats from './FundIndexStats';
import FundIndexTableContainer from './FundIndexTableContainer';
import { useFilterAndSort } from './FilterAndSortLogic';

interface FullIndexTableProps {
  scores: FundScore[];
}

const ITEMS_PER_PAGE = 10;

const FullIndexTable: React.FC<FullIndexTableProps> = ({ scores }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const {
    searchTerm,
    setSearchTerm,
    sortField,
    filters,
    filteredAndSortedScores,
    handleSort,
    handleFiltersChange,
    handleClearFilters
  } = useFilterAndSort(scores);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedScores.length / ITEMS_PER_PAGE);
  const paginatedScores = filteredAndSortedScores.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFiltersChangeWithReset = (newFilters: any) => {
    handleFiltersChange(newFilters);
    setCurrentPage(1);
  };

  const handleClearFiltersWithReset = () => {
    handleClearFilters();
    setCurrentPage(1);
  };

  const handleSortWithReset = (field: any) => {
    handleSort(field);
    setCurrentPage(1);
  };

  return (
    <Card id="full-index" className="shadow-sm border-gray-200">
      <CardHeader className="bg-white border-b border-gray-100 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
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
            onFiltersChange={handleFiltersChangeWithReset}
            onClearFilters={handleClearFiltersWithReset}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
          />
          
          <FundIndexStats
            paginatedCount={paginatedScores.length}
            filteredCount={filteredAndSortedScores.length}
            totalCount={scores.length}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <FundIndexTableContainer
          paginatedScores={paginatedScores}
          sortField={sortField}
          onSort={handleSortWithReset}
        />

        {/* Pagination */}
        <div className="bg-gray-50 border-t border-gray-200 px-6">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredAndSortedScores.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FullIndexTable;
