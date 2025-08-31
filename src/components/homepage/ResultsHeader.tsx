
import React from 'react';
import { Button } from '@/components/ui/button';
import { Fund, FundTag } from '../../data/funds';
import { getGVEligibleFunds } from '../../data/services/gv-eligibility-service';

interface ResultsHeaderProps {
  filteredFunds: Fund[];
  selectedTags: FundTag[];
  searchQuery: string;
  setSelectedTags: (tags: FundTag[]) => void;
  setSearchQuery: (query: string) => void;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  filteredFunds,
  selectedTags,
  searchQuery,
  setSelectedTags,
  setSearchQuery
}) => {
  const gvEligibleFunds = getGVEligibleFunds(filteredFunds);
  
  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-card rounded-lg border border-border">
      <div>
        <p className="text-foreground font-semibold text-lg" role="status">
          {filteredFunds.length} fund{filteredFunds.length !== 1 ? 's' : ''} found
        </p>
        <p className="text-sm text-muted-foreground">
          {gvEligibleFunds.length} Golden Visa eligible
          {gvEligibleFunds.length !== filteredFunds.length && 
            `, ${filteredFunds.length - gvEligibleFunds.length} not eligible`}
        </p>
      </div>
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
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default ResultsHeader;
