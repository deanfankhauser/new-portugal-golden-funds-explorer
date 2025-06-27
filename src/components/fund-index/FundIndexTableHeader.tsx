
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
  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="bg-gray-50 py-4">
      <Button 
        variant="ghost" 
        onClick={() => onSort(field)}
        className="h-auto p-2 font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        {children}
        <ArrowUpDown className="ml-2 h-3 w-3 text-gray-500" />
      </Button>
    </TableHead>
  );

  return (
    <TableHeader>
      <TableRow className="border-b-2 border-gray-200">
        <SortableHeader field="rank">
          <span className="text-sm font-bold">Rank</span>
        </SortableHeader>
        <SortableHeader field="name">
          <span className="text-sm font-bold">Fund Name</span>
        </SortableHeader>
        <TableHead className="bg-gray-50 py-4">
          <span className="text-sm font-bold text-gray-700 px-2">Manager</span>
        </TableHead>
        <SortableHeader field="score">
          <span className="text-sm font-bold">Movingto Score</span>
        </SortableHeader>
        <SortableHeader field="performance">
          <span className="text-sm font-bold">Performance</span>
        </SortableHeader>
        <SortableHeader field="fees">
          <span className="text-sm font-bold">Mgmt Fee</span>
        </SortableHeader>
        <SortableHeader field="minInvestment">
          <span className="text-sm font-bold">Min Investment</span>
        </SortableHeader>
        <TableHead className="bg-gray-50 py-4">
          <span className="text-sm font-bold text-gray-700 px-2">Status</span>
        </TableHead>
        <TableHead className="bg-gray-50 py-4">
          <span className="text-sm font-bold text-gray-700 px-2">Action</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default FundIndexTableHeader;
