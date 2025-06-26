
import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { TableHead, TableHeader, TableRow } from '../ui/table';

type SortField = 'rank' | 'name' | 'score' | 'performance' | 'fees' | 'minInvestment';

interface FundIndexTableHeaderProps {
  sortField: SortField;
  onSort: (field: SortField) => void;
}

const FundIndexTableHeader: React.FC<FundIndexTableHeaderProps> = ({
  sortField,
  onSort
}) => {
  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead>
      <Button 
        variant="ghost" 
        onClick={() => onSort(field)}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        {children}
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    </TableHead>
  );

  return (
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
  );
};

export default FundIndexTableHeader;
