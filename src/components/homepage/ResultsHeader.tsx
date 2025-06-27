
import React from 'react';
import { Button } from '@/components/ui/button';
import { Fund, FundTag } from '../../data/funds';

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
  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg border border-gray-200">
      <div>
        <p className="text-high-contrast font-semibold text-lg" role="status">
          {filteredFunds.length} fund{filteredFunds.length !== 1 ? 's' : ''} found
        </p>
        <p className="text-sm text-medium-contrast">
          All funds are Golden Visa eligible
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
