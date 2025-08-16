
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateFundComparisons } from '../../data/services/comparison-service';
import { Button } from '@/components/ui/button';
import { GitCompare } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';

const ComparisonsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const comparisonsPerPage = 24;
  const comparisons = generateFundComparisons();
  
  const totalPages = Math.ceil(comparisons.length / comparisonsPerPage);
  const startIndex = (currentPage - 1) * comparisonsPerPage;
  const currentComparisons = comparisons.slice(startIndex, startIndex + comparisonsPerPage);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Portugal Golden Visa Investment Fund Comparisons</h2>
        <p className="text-gray-600">
          Compare Portugal Golden Visa investment funds side by side to make informed decisions.
          Browse all {comparisons.length} possible fund comparisons.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentComparisons.map((comparison) => (
          <div key={comparison.slug} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <GitCompare className="h-5 w-5 text-[#EF4444]" />
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  Comparison
                </span>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {comparison.fund1.name} vs {comparison.fund2.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span>{comparison.fund1.category} vs {comparison.fund2.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Investment:</span>
                    <span>€{comparison.fund1.minimumInvestment.toLocaleString()} vs €{comparison.fund2.minimumInvestment.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <Link to={`/compare/${comparison.slug}`}>
                <Button className="w-full bg-[#EF4444] hover:bg-[#EF4444]/90 text-white">
                  Compare Funds
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ComparisonsList;
