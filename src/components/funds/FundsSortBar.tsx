import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FundsSortBarProps {
  count: number;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const FundsSortBar: React.FC<FundsSortBarProps> = ({ count, sortBy, onSortChange }) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{count}</span> fund{count !== 1 ? 's' : ''}
      </p>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[160px] h-9 text-sm bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            <SelectItem value="verified">Verified first</SelectItem>
            <SelectItem value="min-investment-asc">Investment (low→high)</SelectItem>
            <SelectItem value="target-return-desc">Return (high→low)</SelectItem>
            <SelectItem value="newly-added">Newly added</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FundsSortBar;
