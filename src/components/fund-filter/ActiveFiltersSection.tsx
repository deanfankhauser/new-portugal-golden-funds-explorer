
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { FundTag } from '../../data/funds';

interface ActiveFiltersSectionProps {
  selectedTags: FundTag[];
  searchQuery: string;
  onToggleTag: (tag: FundTag) => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

const ActiveFiltersSection: React.FC<ActiveFiltersSectionProps> = ({
  selectedTags,
  searchQuery,
  onToggleTag,
  onClearSearch,
  onClearAll
}) => {
  const hasActiveFilters = selectedTags.length > 0 || searchQuery;

  if (!hasActiveFilters) return null;

  return (
    <div className="pt-6 border-t border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1 rounded-full">
              {tag}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleTag(tag)}
                className="h-auto p-0 ml-1 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full">
              Search: "{searchQuery}"
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSearch}
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
          onClick={onClearAll}
          className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 
                   flex items-center gap-2 rounded-full border-red-200 hover:border-red-300"
        >
          <X className="w-4 h-4" />
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default ActiveFiltersSection;
