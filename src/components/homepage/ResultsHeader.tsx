
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
    <>
      {(selectedTags.length > 0 || searchQuery) && (
        <div className="flex justify-end mb-6">
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
        </div>
      )}
    </>
  );
};

export default ResultsHeader;
