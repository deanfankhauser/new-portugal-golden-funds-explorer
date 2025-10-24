import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FundTag } from '../../data/types/funds';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search, ChevronDown } from 'lucide-react';
import { analytics } from '../../utils/analytics';
import { getMeaningfulFilters } from '../../services/filterDataService';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface StreamlinedFilterProps {
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StreamlinedFilter: React.FC<StreamlinedFilterProps> = ({ 
  selectedTags, 
  setSelectedTags, 
  searchQuery, 
  setSearchQuery 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  
  const allFilters = getMeaningfulFilters();
  const displayedFilters = allFilters.slice(0, 9);
  const hasMoreTags = allFilters.length > 9;

  const toggleTag = (tag: FundTag) => {
    const newTags = selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    analytics.trackFilterUsage(newTags, searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      analytics.trackSearch(value.trim(), 0);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery('');
    analytics.trackEvent('filters_cleared');
  };

  const hasActiveFilters = selectedTags.length > 0 || searchQuery.trim() !== '';

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Search */}
      <div className="p-4 sm:p-6">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
            searchFocus ? 'text-primary' : 'text-muted-foreground'
          }`} />
          <Input
            type="text"
            placeholder="Search funds..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            className={`pl-10 h-11 rounded-lg border transition-all ${
              searchFocus 
                ? 'border-primary ring-2 ring-primary/20' 
                : 'border-border'
            }`}
          />
        </div>
      </div>

      {/* Filter by tags dropdown */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between h-11 font-medium"
            >
              <span>Filter by tags</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3">
            <div className="space-y-1">
              {displayedFilters.map(filter => (
                <button
                  key={filter.tag}
                  onClick={() => toggleTag(filter.tag)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedTags.includes(filter.tag)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-foreground hover:bg-secondary'
                  }`}
                >
                  <span className="text-left">{filter.label}</span>
                  <span className="text-xs opacity-75 ml-2">
                    {filter.count}
                  </span>
                </button>
              ))}
              
              {hasMoreTags && (
                <Link to="/tags" className="block mt-2">
                  <Button
                    variant="ghost"
                    className="w-full text-sm text-muted-foreground hover:text-foreground"
                  >
                    See all tags →
                  </Button>
                </Link>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-border">
          <div className="flex items-start gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground pt-1.5">
              Active:
            </span>
            <div className="flex flex-wrap gap-2 flex-1">
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
                >
                  {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="hover:text-foreground transition-colors"
                    aria-label={`Remove ${tag} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
                  Search: "{searchQuery.substring(0, 20)}{searchQuery.length > 20 ? '...' : ''}"
                  <button
                    onClick={() => handleSearchChange('')}
                    className="hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamlinedFilter;
