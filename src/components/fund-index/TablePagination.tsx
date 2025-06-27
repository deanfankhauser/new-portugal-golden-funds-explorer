
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const renderPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => onPageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is far from start
      if (currentPage > 4) {
        pages.push(<PaginationEllipsis key="ellipsis-start" />);
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => onPageChange(i)}
                isActive={currentPage === i}
                className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 3) {
        pages.push(<PaginationEllipsis key="ellipsis-end" />);
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => onPageChange(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-2">
      <div className="text-sm text-gray-600 font-medium order-2 sm:order-1">
        Showing <span className="text-gray-900 font-semibold">{startItem}</span> to{' '}
        <span className="text-gray-900 font-semibold">{endItem}</span> of{' '}
        <span className="text-gray-900 font-semibold">{totalItems}</span> funds
      </div>
      
      <div className="order-1 sm:order-2">
        <Pagination>
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                className={`cursor-pointer transition-all duration-200 ${
                  currentPage === 1 
                    ? 'pointer-events-none opacity-40 cursor-not-allowed' 
                    : 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                }`}
              />
            </PaginationItem>
            
            {renderPageNumbers()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                className={`cursor-pointer transition-all duration-200 ${
                  currentPage === totalPages 
                    ? 'pointer-events-none opacity-40 cursor-not-allowed' 
                    : 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default TablePagination;
