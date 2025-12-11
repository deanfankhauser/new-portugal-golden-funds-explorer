
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateComparisonsFromFunds } from '../../data/services/comparison-service';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';
import { Button } from '@/components/ui/button';
import { GitCompare, Loader2 } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';

const ComparisonsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const comparisonsPerPage = 24;
  
  // Fetch all funds from database
  const { funds: allFunds, loading: isLoading } = useRealTimeFunds();
  
  // Generate comparisons from database funds
  const comparisons = allFunds ? generateComparisonsFromFunds(allFunds) : [];
  
  const totalPages = Math.ceil(comparisons.length / comparisonsPerPage);
  const startIndex = (currentPage - 1) * comparisonsPerPage;
  const currentComparisons = comparisons.slice(startIndex, startIndex + comparisonsPerPage);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading comparisons...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Portugal Golden Visa Investment Fund Comparisons</h2>
        <p className="text-muted-foreground">
          Compare Portugal Golden Visa investment funds side by side to make informed decisions.
          Browse all {comparisons.length} possible fund comparisons.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentComparisons.map((comparison) => (
          <div key={comparison.slug} className="group bg-card rounded-xl border border-border p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <GitCompare className="h-5 w-5 text-primary" />
                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                  Comparison
                </span>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  {comparison.fund1.name} vs {comparison.fund2.name}
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
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
                <Button className="w-full group-hover:bg-primary/90">
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

      {/* SEO: Expose all comparison links visibly for crawlers */}
      <nav aria-label="All fund comparison links" className="mt-10">
        <h2 className="text-lg font-semibold mb-3">All Fund Comparison Links</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {comparisons.map((c) => (
            <li key={`all-link-${c.slug}`}>
              <a href={`/compare/${c.slug}`} className="underline underline-offset-2 hover:no-underline">
                {c.fund1.name} vs {c.fund2.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default ComparisonsList;
