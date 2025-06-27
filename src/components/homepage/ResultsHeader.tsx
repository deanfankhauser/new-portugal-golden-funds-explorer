
import React from 'react';
import { Button } from '@/components/ui/button';
import { Fund, FundTag } from '../../data/funds';
import { Filter, X, Sparkles } from 'lucide-react';

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
  const hasActiveFilters = selectedTags.length > 0 || searchQuery.trim() !== '';

  return (
    <div className="relative mb-8 p-6 sm:p-8 bg-gradient-to-br from-white via-white to-gray-50/30 
                   rounded-3xl border-2 border-gray-200/50 shadow-lg backdrop-blur-sm
                   hover:shadow-xl transition-all duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 
                     to-transparent rounded-full blur-2xl"></div>
      
      <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
        <div className="space-y-3">
          {/* Enhanced results count */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-high-contrast font-bold text-2xl sm:text-3xl" role="status">
                {filteredFunds.length} fund{filteredFunds.length !== 1 ? 's' : ''} found
              </p>
              <p className="text-medium-contrast text-base sm:text-lg font-medium">
                All funds are Golden Visa eligible
              </p>
            </div>
          </div>
          
          {/* Enhanced filter status */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 
                           px-4 py-2 rounded-full w-fit">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold">
                {selectedTags.length + (searchQuery ? 1 : 0)} active filter
                {(selectedTags.length + (searchQuery ? 1 : 0)) !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              setSelectedTags([]);
              setSearchQuery('');
            }}
            className="self-start sm:self-center text-base font-semibold px-6 py-3 h-auto
                     border-2 border-red-200 text-red-600 hover:text-red-700 
                     hover:bg-red-50 hover:border-red-300 rounded-xl
                     transition-all duration-300 hover:scale-105 hover:shadow-md
                     flex items-center gap-3"
          >
            <X className="h-5 w-5" />
            Clear all filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResultsHeader;
