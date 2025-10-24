
import React, { useState, useEffect } from 'react';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { InvestmentFundStructuredDataService } from '../../services/investmentFundStructuredDataService';
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
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  
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

  // Apply verified filter
  const finalFilteredScores = showOnlyVerified 
    ? filteredAndSortedScores.filter(score => {
        const fund = getFundById(score.fundId);
        return fund?.isVerified === true;
      })
    : filteredAndSortedScores;

  // Pagination
  const totalPages = Math.ceil(finalFilteredScores.length / ITEMS_PER_PAGE);
  const paginatedScores = finalFilteredScores.slice(
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

  // Add structured data for fund index
  useEffect(() => {
    const funds = finalFilteredScores.map(score => getFundById(score.fundId)).filter(Boolean);
    const listSchema = InvestmentFundStructuredDataService.generateFundListSchema(funds, "fund-index");
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'fund-index-schema';
    script.textContent = JSON.stringify(listSchema, null, 2);
    document.head.appendChild(script);
    
    return () => {
      const existingScript = document.getElementById('fund-index-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [finalFilteredScores]);

  return (
    <section 
      id="full-index" 
      itemScope 
      itemType="https://schema.org/Table"
      aria-labelledby="full-index-title"
    >
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-white border-b border-gray-100 rounded-t-lg">
          <CardTitle 
            id="full-index-title"
            className="flex items-center gap-2 text-xl text-gray-900"
            itemProp="name"
          >
            Complete Fund Index
          </CardTitle>
          <div className="space-y-4">
            <FundIndexControls
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              filteredScores={finalFilteredScores}
              showOnlyVerified={showOnlyVerified}
              onShowOnlyVerifiedChange={setShowOnlyVerified}
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
              filteredCount={finalFilteredScores.length}
              totalCount={scores.length}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0" itemProp="mainEntity" itemScope itemType="https://schema.org/ItemList">
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
              totalItems={finalFilteredScores.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FullIndexTable;
