
import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { TableHead, TableHeader, TableRow } from '../ui/table';
import { SortField } from './FilterAndSortLogic';

interface FundIndexTableHeaderProps {
  sortField: SortField;
  onSort: (field: SortField) => void;
}

const FundIndexTableHeader: React.FC<FundIndexTableHeaderProps> = ({
  sortField,
  onSort
}) => {
  const SortableHeader = ({ field, children, className = "" }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <TableHead className={`bg-gray-50 py-3 ${className}`}>
      <Button 
        variant="ghost" 
        onClick={() => onSort(field)}
        className="h-auto p-1 font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors text-xs"
      >
        {children}
        <ArrowUpDown className="ml-1 h-3 w-3 text-gray-500" />
      </Button>
    </TableHead>
  );

  return (
    <TableHeader>
      <TableRow className="border-b-2 border-gray-200">
        <SortableHeader field="rank" className="w-16">
          <span className="text-xs font-bold">#</span>
        </SortableHeader>
        <SortableHeader field="name" className="min-w-48">
          <span className="text-xs font-bold">Fund</span>
        </SortableHeader>
        <TableHead className="bg-gray-50 py-3 w-32">
          <span className="text-xs font-bold text-gray-700 px-1">Manager</span>
        </TableHead>
        <SortableHeader field="score" className="w-20 text-center">
          <span className="text-xs font-bold">Score</span>
        </SortableHeader>
        <SortableHeader field="performance" className="w-24 text-center">
          <span className="text-xs font-bold">Perf</span>
        </SortableHeader>
        <SortableHeader field="fees" className="w-20 text-center">
          <span className="text-xs font-bold">Fee</span>
        </SortableHeader>
        <SortableHeader field="minInvestment" className="w-24 text-center">
          <span className="text-xs font-bold">Min €</span>
        </SortableHeader>
        <TableHead className="bg-gray-50 py-3 w-20 text-center">
          <span className="text-xs font-bold text-gray-700">Status</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default FundIndexTableHeader;
