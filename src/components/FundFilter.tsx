
import React, { useState } from 'react';
import { FundTag, getAllTags } from '../data/funds';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PasswordDialog from './PasswordDialog';
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
  
  // Show first 6 tags initially, then show all when expanded
  const visibleTags = showAllTags ? allTags : allTags.slice(0, 6);
  const hasMoreTags = allTags.length > 6;
  
  const scrollToTop = () => {
    // Multiple approaches to ensure reliable scrolling
    const performScroll = () => {
      // Method 1: Instant scroll to top
      window.scrollTo(0, 0);
      
      // Method 2: Smooth scroll as backup
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Method 3: Direct DOM manipulation
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    // Execute immediately
    performScroll();
    
    // Execute after React updates (using setTimeout to escape current execution context)
    setTimeout(performScroll, 0);
    
    // Execute after animation frame
    requestAnimationFrame(performScroll);
    
    // Execute after a short delay to ensure all React updates are complete
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
    
    // Track filter usage
    analytics.trackFilterUsage(newTags, searchQuery);
    
    // Scroll to top after state update
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
      
      // Track search if there's a value
      if (value.trim()) {
        analytics.trackSearch(value.trim(), 0); // Results count will be updated from parent component
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
    
    // Track filter clear
    analytics.trackEvent('filters_cleared');
    
    // Scroll to top after clearing filters
    scrollToTop();
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 overflow-hidden">
        <h2 className="text-lg font-semibold mb-4">Filter Funds</h2>
        
        <div className="mb-4">
          <label htmlFor="search" className="block mb-1 text-sm font-medium">Search</label>
          <Input
            id="search"
            type="text"
            placeholder={isAuthenticated ? "Search funds..." : "Click to access client features"}
            value={isAuthenticated ? searchQuery : ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            onClick={handleSearchClick}
            className="w-full cursor-pointer"
            readOnly={!isAuthenticated}
          />
        </div>
        
        <div className="overflow-hidden">
          <label className="block mb-2 text-sm font-medium">Filter by Tags</label>
          <div className="flex flex-wrap gap-2 w-full">
            {visibleTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
                className={`${selectedTags.includes(tag) ? 
                  "bg-[#EF4444] hover:bg-[#EF4444]/90 text-white" : 
                  "border-gray-300 hover:bg-[#f0f0f0] text-gray-700 hover:text-gray-800"} 
                  text-xs px-2 py-1 h-auto min-h-[28px] break-words hyphens-auto max-w-full`}
                style={{ wordBreak: 'break-word' }}
              >
                <span className="leading-tight">{tag}</span>
              </Button>
            ))}
          </div>
          
          {hasMoreTags && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllTags(!showAllTags)}
              className="mt-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 flex items-center gap-1"
            >
              {showAllTags ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show more ({allTags.length - 6} more)
                </>
              )}
            </Button>
          )}
        </div>
        
        {(selectedTags.length > 0 || searchQuery) && (
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium">{selectedTags.length}</span> tag{selectedTags.length !== 1 ? 's' : ''} selected
              {searchQuery && <span> with search query</span>}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-sm text-[#EF4444] hover:text-[#EF4444] hover:bg-[#f0f0f0] flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Clear filters
            </Button>
          </div>
        )}
      </div>

      <PasswordDialog 
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </>
  );
};

export default FundFilter;
