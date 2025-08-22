import React, { useState } from 'react';
import { FundTag, getAllTags } from '../../data/funds';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LazyPasswordDialog from '../common/LazyPasswordDialog';
import { analytics } from '../../utils/analytics';

interface CompactFilterProps {
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CompactFilter: React.FC<CompactFilterProps> = ({ 
  selectedTags, 
  setSelectedTags, 
  searchQuery, 
  setSearchQuery 
}) => {
  const allTags = getAllTags();
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Categorize tags for better organization
  const quickFilters = [
    { label: 'Low Risk', tag: 'Low Risk' as FundTag },
    { label: 'Real Estate', tag: 'Real Estate' as FundTag },
    { label: 'Under €300k', tag: 'Under €350k Investment' as FundTag },
    { label: 'Open Now', tag: 'Open' as FundTag },
  ];

  const categoryTags = allTags.filter(tag => 
    ['Venture Capital', 'Private Equity', 'Real Estate', 'Mixed', 'Infrastructure', 'Debt'].includes(tag)
  );
  const riskTags = allTags.filter(tag => 
    ['Low Risk', 'Medium Risk', 'High Risk', 'Conservative', 'Aggressive'].includes(tag)
  );
  const investmentTags = allTags.filter(tag => 
    tag.includes('€') || tag.includes('Investment')
  );

  const toggleTag = (tag: FundTag) => {
    if (!isAuthenticated) {
      setShowPasswordDialog(true);
      return;
    }
    
    const newTags = selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    analytics.trackFilterUsage(newTags, searchQuery);
  };

  const handleSearchClick = () => {
    if (!isAuthenticated) {
      setShowPasswordDialog(true);
      return;
    }
  };

  const handleSearchChange = (value: string) => {
    if (isAuthenticated) {
      setSearchQuery(value);
      if (value.trim()) {
        analytics.trackSearch(value.trim(), 0);
      }
    }
  };

  const clearFilters = () => {
    if (!isAuthenticated) {
      setShowPasswordDialog(true);
      return;
    }
    setSelectedTags([]);
    setSearchQuery('');
    analytics.trackEvent('filters_cleared');
  };

  const renderTagGroup = (title: string, tags: FundTag[]) => {
    if (tags.length === 0) return null;
    
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTag(tag)}
              className={`${selectedTags.includes(tag) ? 
                "bg-primary text-primary-foreground shadow-sm" : 
                "border-border hover:bg-muted text-foreground hover:border-accent"} 
                text-xs px-3 py-1.5 h-auto rounded-full transition-all duration-200`}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const activeFiltersCount = selectedTags.length + (searchQuery ? 1 : 0);

  return (
    <>
      <div className="sticky top-4 z-20 bg-background/95 backdrop-blur-sm border border-border rounded-2xl shadow-lg">
        {/* Compact Search and Filter Bar */}
        <div className="p-4">
          <div className="flex gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                searchFocus ? 'text-accent' : 'text-muted-foreground'
              }`} />
              <Input
                type="text"
                placeholder={isAuthenticated ? "Search funds..." : "Access to search"}
                value={isAuthenticated ? searchQuery : ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                onClick={handleSearchClick}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                className={`pl-10 h-11 rounded-xl border-2 transition-all duration-200 ${
                  searchFocus 
                    ? 'border-accent ring-2 ring-accent/20' 
                    : 'border-border hover:border-accent'
                } ${!isAuthenticated ? 'cursor-pointer' : ''}`}
                readOnly={!isAuthenticated}
              />
            </div>
            
            {/* Filter Toggle */}
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-11 px-4 rounded-xl border-2 transition-all duration-200 ${
                    activeFiltersCount > 0 
                      ? 'border-accent bg-accent/10 text-accent' 
                      : 'border-border hover:border-accent'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs rounded-full">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
                <div className="p-6 space-y-6">
                  {/* Quick Filters */}
                  {isAuthenticated && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium text-foreground">Popular</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {quickFilters.map(filter => (
                          <Badge
                            key={filter.label}
                            variant={selectedTags.includes(filter.tag) ? "default" : "outline"}
                            className={`cursor-pointer transition-all duration-200 px-3 py-1.5 rounded-full ${
                              selectedTags.includes(filter.tag)
                                ? 'bg-accent text-accent-foreground'
                                : 'hover:bg-accent/10 hover:text-accent hover:border-accent'
                            }`}
                            onClick={() => toggleTag(filter.tag)}
                          >
                            {filter.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-border flex-1"></div>
                    <span className="text-xs text-muted-foreground">All Filters</span>
                    <div className="h-px bg-border flex-1"></div>
                  </div>

                  {/* Categorized Filters */}
                  <div className="space-y-6">
                    {renderTagGroup('Categories', categoryTags)}
                    {renderTagGroup('Risk Level', riskTags)}
                    {renderTagGroup('Investment Size', investmentTags.slice(0, 6))}
                  </div>

                  {/* Actions */}
                  {(selectedTags.length > 0 || searchQuery) && (
                    <div className="pt-4 border-t border-border">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearFilters}
                        className="w-full text-muted-foreground hover:text-foreground rounded-xl"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Filters Bar */}
        {(selectedTags.length > 0 || searchQuery) && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
              <span className="text-xs font-medium text-muted-foreground">Active:</span>
              {selectedTags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 rounded-full text-xs">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTag(tag)}
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1 rounded-full text-xs">
                  Search: "{searchQuery.length > 15 ? searchQuery.substring(0, 15) + '...' : searchQuery}"
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSearchChange('')}
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      <LazyPasswordDialog 
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </>
  );
};

export default CompactFilter;