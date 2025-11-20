
import React from 'react';
import { Button } from '@/components/ui/button';
import { Fund, FundTag } from '../../data/funds';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResultsHeaderProps {
  filteredFunds: Fund[];
  selectedTags: FundTag[];
  searchQuery: string;
  setSelectedTags: (tags: FundTag[]) => void;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  filteredFunds,
  selectedTags,
  searchQuery,
  setSelectedTags,
  setSearchQuery,
  sortBy,
  setSortBy
}) => {
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      {/* Results Count - Left */}
      <div className="text-sm text-medium-contrast">
        Showing {filteredFunds.length} {filteredFunds.length === 1 ? 'fund' : 'funds'}
      </div>

      {/* Sort Dropdown & Reset Button - Right */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-medium-contrast whitespace-nowrap">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[220px] bg-background border-border">
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border z-50">
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="min-investment-asc">Min. investment (low → high)</SelectItem>
              <SelectItem value="target-return-desc">Target return (high → low)</SelectItem>
              <SelectItem value="risk-asc">Risk (low → high)</SelectItem>
              <SelectItem value="newly-added">Newly added</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters Button */}
        {(selectedTags.length > 0 || searchQuery) && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedTags([]);
              setSearchQuery('');
            }}
            className="text-sm"
          >
            Reset all filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResultsHeader;
