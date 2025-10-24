import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FundTag } from '../../data/types/funds';
import { Button } from "@/components/ui/button";
import { X, ChevronDown } from 'lucide-react';
import { getMeaningfulFilters } from '../../services/filterDataService';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface StreamlinedFilterProps {
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
}

const StreamlinedFilter: React.FC<StreamlinedFilterProps> = ({
  selectedTags,
  setSelectedTags
}) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const allFilters = getMeaningfulFilters();

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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filter by tags</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Tags Dropdown */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-3 h-auto hover:bg-muted"
          >
            <span className="font-medium">Select tags</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-2 pt-2">
          <div className="flex flex-wrap gap-2 w-full">
            {allFilters.map((filter) => {
              const isSelected = selectedTags.includes(filter.tag);
              
              return (
                <Button
                  key={filter.tag}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(filter.tag)}
                  className="text-left justify-start max-w-full break-words whitespace-normal h-auto py-2"
                >
                  {filter.label} ({filter.count})
                </Button>
              );
            })}
          </div>

          <Link
            to="/tags"
            className="flex items-center gap-2 text-sm text-primary hover:underline pt-2"
          >
            See all tags →
          </Link>
        </CollapsibleContent>
      </Collapsible>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t w-full">
          {selectedTags.map(tag => (
            <div key={tag} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm max-w-full break-words">
              <span className="break-words">{tag}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleTag(tag)}
                className="h-4 w-4 p-0 hover:bg-primary/20 shrink-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StreamlinedFilter;