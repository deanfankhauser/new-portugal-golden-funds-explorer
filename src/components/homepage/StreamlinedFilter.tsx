import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FundTag } from '../../data/types/funds';
import { Button } from "@/components/ui/button";
import { X, ChevronDown } from 'lucide-react';
import { getMeaningfulFilters } from '../../services/filterDataService';
import { useAllFunds } from '../../hooks/useFundsQuery';
import { addTagsToFunds } from '../../data/services/funds-service';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface StreamlinedFilterProps {
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
  showOnlyVerified: boolean;
  setShowOnlyVerified: (value: boolean) => void;
}

const StreamlinedFilter: React.FC<StreamlinedFilterProps> = ({
  selectedTags,
  setSelectedTags,
  showOnlyVerified,
  setShowOnlyVerified
}) => {
  const [isOpen, setIsOpen] = useState(() => {
    // Default to closed on mobile (< 1024px), open on desktop
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });
  
  const { data: funds = [], isLoading } = useAllFunds();
  const fundsWithTags = addTagsToFunds(funds);
  const allFilters = getMeaningfulFilters(fundsWithTags);

  const toggleTag = (tag: FundTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  const hasActiveFilters = selectedTags.length > 0;

  return (
    <div className="bg-card rounded-lg shadow-sm border p-4 space-y-4">
      {/* Tags Dropdown */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-4">
        <div className="flex items-center justify-between gap-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex-1 justify-between p-3 h-auto hover:bg-muted"
            >
              <span className="font-semibold text-base">
                Filter by Investor Profile{!isOpen && hasActiveFilters && ` (${selectedTags.length})`}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              Clear all
            </Button>
          )}
        </div>

        <CollapsibleContent className="space-y-2 pt-2">
          {/* Priority Tags - Top 6-8 most useful filters */}
          <div className="flex flex-wrap gap-2 w-full">
            {allFilters.slice(0, 8).map((filter) => {
              const isSelected = selectedTags.includes(filter.tag);
              
              return (
                <Button
                  key={filter.tag}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(filter.tag)}
                  className="text-left justify-start max-w-full break-words whitespace-normal h-auto py-2 min-h-[36px]"
                >
                  <span className="break-words">{filter.label} ({filter.count})</span>
                </Button>
              );
            })}
          </div>

          <Link to="/tags">
            <Button
              variant="outline"
              className="w-full mt-3"
            >
              See more filters
            </Button>
          </Link>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default StreamlinedFilter;