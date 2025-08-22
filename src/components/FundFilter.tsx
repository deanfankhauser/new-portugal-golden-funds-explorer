
import React, { useState } from 'react';
import { FundTag, getAllTags } from '../data/funds';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, ChevronUp, Search, Filter, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LazyPasswordDialog from './common/LazyPasswordDialog';
import { analytics } from '../utils/analytics';

interface FundFilterProps {
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const FundFilter: React.FC<FundFilterProps> = ({ 
  selectedTags, 
  setSelectedTags, 
  searchQuery, 
  setSearchQuery 
}) => {
  const allTags = getAllTags();
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  
  // Categorize tags for better organization
  const categoryTags = allTags.filter(tag => 
    ['Venture Capital', 'Private Equity', 'Real Estate', 'Mixed', 'Infrastructure', 'Debt'].includes(tag)
  );
  const investmentTags = allTags.filter(tag => 
    tag.includes('€') || tag.includes('Investment')
  );
  const riskTags = allTags.filter(tag => 
    ['Low Risk', 'Medium Risk', 'High Risk', 'Conservative', 'Aggressive'].includes(tag)
  );
  const otherTags = allTags.filter(tag => 
    !categoryTags.includes(tag) && !investmentTags.includes(tag) && !riskTags.includes(tag)
  );
  
  // Show first 6 tags initially, then show all when expanded
  const visibleTags = showAllTags ? allTags : allTags.slice(0, 6);
  const hasMoreTags = allTags.length > 6;
  
  // Quick filter suggestions
  const quickFilters = [
    { label: 'Low Risk', tag: 'Low Risk' as FundTag },
    { label: 'Real Estate', tag: 'Real Estate' as FundTag },
    { label: 'Under €300k', tag: 'Under €350k Investment' as FundTag },
    { label: 'Open Now', tag: 'Open' as FundTag },
  ];
  
  const scrollToTop = () => {
    const performScroll = () => {
      window.scrollTo(0, 0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    performScroll();
    setTimeout(performScroll, 0);
    requestAnimationFrame(performScroll);
    setTimeout(performScroll, 100);
  };
  
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
    scrollToTop();
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
    scrollToTop();
  };

  const renderTagGroup = (title: string, tags: FundTag[], icon: React.ReactNode) => {
    if (tags.length === 0) return null;
    
    return (
      <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1 bg-primary/10 rounded-lg">
              {icon}
            </div>
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTag(tag)}
              className={`${selectedTags.includes(tag) ? 
                "bg-primary hover:bg-primary/90 text-white shadow-md" : 
                "border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-800 hover:border-gray-400"} 
                text-xs px-3 py-2 h-auto min-h-[32px] rounded-full transition-all duration-200 
                hover:scale-105 hover:shadow-sm`}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-secondary to-background">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Search & Filter</h2>
          </div>
          <p className="text-sm text-muted-foreground">Find your perfect investment fund</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Enhanced Search */}
          <div className="space-y-3">
            <label htmlFor="search" className="block text-sm font-semibold text-foreground">
              Search Funds
            </label>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                searchFocus ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <Input
                id="search"
                type="text"
                placeholder={isAuthenticated ? "Search by name, manager, or description..." : "Click to access search"}
                value={isAuthenticated ? searchQuery : ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                onClick={handleSearchClick}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                className={`pl-10 h-12 rounded-xl border-2 transition-all duration-200 ${
                  searchFocus 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-accent'
                } ${!isAuthenticated ? 'cursor-pointer' : ''}`}
                readOnly={!isAuthenticated}
              />
            </div>
          </div>

          {/* Quick Filters */}
          {isAuthenticated && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <label className="text-sm font-semibold text-foreground">Popular Filters</label>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickFilters.map(filter => (
                  <Badge
                    key={filter.label}
                    variant={selectedTags.includes(filter.tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 px-3 py-1.5 rounded-full ${
                      selectedTags.includes(filter.tag)
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'hover:bg-primary/10 hover:text-primary hover:border-primary'
                    }`}
                    onClick={() => toggleTag(filter.tag)}
                  >
                    {filter.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Categorized Tag Groups */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px bg-border flex-1"></div>
                <span className="text-sm font-medium text-muted-foreground px-3">All Filters</span>
                <div className="h-px bg-border flex-1"></div>
              </div>

            {!showAllTags ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {visibleTags.map(tag => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      className={`${selectedTags.includes(tag) ? 
                        "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md" : 
                        "border-border hover:bg-muted text-foreground hover:text-foreground hover:border-accent"} 
                        text-xs px-3 py-2 h-auto min-h-[32px] rounded-full transition-all duration-200 
                        hover:scale-105 hover:shadow-sm`}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {renderTagGroup('Investment Categories', categoryTags, <Filter className="h-4 w-4 text-primary" />)}
                {renderTagGroup('Investment Amounts', investmentTags, <span className="text-primary font-bold text-sm">€</span>)}
                {renderTagGroup('Risk Levels', riskTags, <span className="text-primary font-bold text-xs">⚡</span>)}
                {renderTagGroup('Other Filters', otherTags, <span className="text-primary font-bold text-xs">•</span>)}
              </div>
            )}
            
            {hasMoreTags && (
              <Button
                variant="ghost"
                onClick={() => setShowAllTags(!showAllTags)}
                className="w-full mt-4 text-muted-foreground hover:text-foreground hover:bg-muted 
                         flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-dashed 
                         border-border hover:border-accent transition-all duration-200"
              >
                {showAllTags ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less Filters
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show All Filters ({allTags.length - 6} more)
                  </>
                )}
              </Button>
            )}
          </div>
          
          {/* Active Filters Summary */}
          {(selectedTags.length > 0 || searchQuery) && (
            <div className="pt-6 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Active filters:</span>
                  {selectedTags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1 rounded-full">
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
                    <Badge variant="secondary" className="flex items-center gap-1 rounded-full">
                      Search: "{searchQuery}"
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-sm text-destructive hover:text-destructive/90 hover:bg-destructive/10 
                           flex items-center gap-2 rounded-full border-destructive/20 hover:border-destructive/30"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <LazyPasswordDialog 
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </>
  );
};

export default FundFilter;
