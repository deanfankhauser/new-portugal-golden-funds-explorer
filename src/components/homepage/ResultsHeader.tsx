
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Filter, CheckCircle2 } from 'lucide-react';
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
  const hasActiveFilters = selectedTags.length > 0 || searchQuery.trim() !== '';

  return (
    <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200 
                    shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Results count and status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-high-contrast font-bold text-xl" role="status">
                {filteredFunds.length} fund{filteredFunds.length !== 1 ? 's' : ''} found
              </p>
              <p className="text-sm text-medium-contrast">
                All funds are Golden Visa eligible
              </p>
            </div>
          </div>
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Active filters:
              </span>
              {selectedTags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 rounded-full">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {selectedTags.length > 3 && (
                <Badge variant="outline" className="rounded-full">
                  +{selectedTags.length - 3} more
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1 rounded-full">
                  Search: "{searchQuery.length > 20 ? searchQuery.substring(0, 20) + '...' : searchQuery}"
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedTags([]);
                setSearchQuery('');
              }}
              className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 
                         flex items-center gap-2 rounded-full border-red-200 hover:border-red-300
                         transition-all duration-200 hover:scale-105"
            >
              <X className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsHeader;
