
import React, { useState, useEffect } from 'react';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
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

  useEffect(() => {
    // Create comprehensive structured data for the full fund index
    const fullIndexSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': '2025 Complete Golden Visa Fund Index',
      'description': 'Comprehensive ranking and comparison of all Golden Visa investment funds in Portugal',
      'numberOfItems': scores.length,
      'itemListOrder': 'Descending',
      'dateModified': new Date().toISOString(),
      'author': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': 'https://movingto.com'
      },
      'about': [
        'Portugal Golden Visa',
        'Investment Funds',
        'Fund Comparison',
        'Financial Products'
      ],
      'itemListElement': scores.map((score, index) => {
        const fund = getFundById(score.fundId);
        if (!fund) return null;
        
        return {
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'FinancialProduct',
            'name': fund.name,
            'description': fund.description,
            'category': fund.category,
            'identifier': fund.id,
            'url': `https://movingto.com/funds/funds/${fund.id}`,
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': score.movingtoScore,
              'bestRating': 100,
              'worstRating': 0,
              'ratingCount': 1,
              'reviewCount': 1
            },
            'offers': {
              '@type': 'Offer',
              'price': fund.minimumInvestment,
              'priceCurrency': 'EUR',
              'availability': fund.fundStatus === 'Open' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
            },
            'provider': {
              '@type': 'Organization',
              'name': fund.managerName,
              'url': fund.websiteUrl,
              'foundingDate': fund.established.toString()
            },
            'additionalProperty': [
              {
                '@type': 'PropertyValue',
                'name': 'Management Fee',
                'value': `${fund.managementFee}%`
              },
              {
                '@type': 'PropertyValue',
                'name': 'Performance Fee',
                'value': `${fund.performanceFee}%`
              },
              {
                '@type': 'PropertyValue',
                'name': 'Fund Size',
                'value': `${fund.fundSize} Million EUR`
              },
              {
                '@type': 'PropertyValue',
                'name': 'Performance Score',
                'value': score.performanceScore
              },
              {
                '@type': 'PropertyValue',
                'name': 'Regulatory Score',
                'value': score.regulatoryScore
              },
              {
                '@type': 'PropertyValue',
                'name': 'Fee Score',
                'value': score.feeScore
              },
              {
                '@type': 'PropertyValue',
                'name': 'Protection Score',
                'value': score.protectionScore
              },
              {
                '@type': 'PropertyValue',
                'name': 'Movingto Score',
                'value': score.movingtoScore
              },
              {
                '@type': 'PropertyValue',
                'name': 'Fund Status',
                'value': fund.fundStatus
              },
              {
                '@type': 'PropertyValue',
                'name': 'Target Return',
                'value': fund.returnTarget
              }
            ]
          }
        };
      }).filter(Boolean)
    };

    // Add comprehensive table schema
    const tableSchema = {
      '@context': 'https://schema.org',
      '@type': 'Table',
      'name': 'Complete Golden Visa Fund Index Table',
      'description': 'Comprehensive comparison table of all Golden Visa investment funds with detailed scores, fees, and metrics',
      'about': 'Portugal Golden Visa Investment Funds Comparison',
      'caption': 'Complete fund index with sorting, filtering, and detailed comparison capabilities',
      'mainEntity': {
        '@type': 'ItemList',
        'numberOfItems': scores.length
      }
    };

    // Add dataset schema for LLM understanding
    const datasetSchema = {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      'name': '2025 Golden Visa Fund Performance Data',
      'description': 'Comprehensive dataset of Golden Visa investment fund performance, fees, and regulatory compliance scores',
      'keywords': [
        'Portugal Golden Visa',
        'Investment Funds',
        'Fund Performance',
        'Management Fees',
        'Regulatory Compliance',
        'Fund Scores',
        'Investment Migration'
      ],
      'creator': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': 'https://movingto.com'
      },
      'dateModified': new Date().toISOString(),
      'distribution': {
        '@type': 'DataDownload',
        'encodingFormat': 'application/ld+json',
        'contentUrl': 'https://movingto.com/funds/index'
      }
    };

    // Remove existing schemas
    const existingSchemas = ['full-index-list', 'full-index-table', 'fund-dataset'];
    existingSchemas.forEach(schemaId => {
      const existing = document.querySelector(`script[data-schema="${schemaId}"]`);
      if (existing) existing.remove();
    });

    // Add new schemas
    const schemas = [
      { id: 'full-index-list', data: fullIndexSchema },
      { id: 'full-index-table', data: tableSchema },
      { id: 'fund-dataset', data: datasetSchema }
    ];

    schemas.forEach(({ id, data }) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', id);
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

    // Cleanup
    return () => {
      existingSchemas.forEach(schemaId => {
        const cleanup = document.querySelector(`script[data-schema="${schemaId}"]`);
        if (cleanup) cleanup.remove();
      });
    };
  }, [scores]);

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
              totalItems={filteredAndSortedScores.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FullIndexTable;
