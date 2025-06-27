
import React, { useState } from 'react';
import { FundTag } from '../data/funds';
import { useAuth } from '../contexts/AuthContext';
import PasswordDialog from './PasswordDialog';
import { analytics } from '../utils/analytics';
import FundFilterHeader from './fund-filter/FundFilterHeader';
import SearchSection from './fund-filter/SearchSection';
import QuickFiltersSection from './fund-filter/QuickFiltersSection';
import TagGroupSection from './fund-filter/TagGroupSection';
import ActiveFiltersSection from './fund-filter/ActiveFiltersSection';

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
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
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

  const handleAuthRequired = () => {
    setShowPasswordDialog(true);
  };

  const handleClearSearch = () => {
    if (isAuthenticated) {
      setSearchQuery('');
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

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <FundFilterHeader />

        <div className="p-6 space-y-6">
          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAuthRequired={handleAuthRequired}
          />

          <QuickFiltersSection
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
          />

          <TagGroupSection
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
          />
          
          <ActiveFiltersSection
            selectedTags={selectedTags}
            searchQuery={searchQuery}
            onToggleTag={toggleTag}
            onClearSearch={handleClearSearch}
            onClearAll={clearFilters}
          />
        </div>
      </div>

      <PasswordDialog 
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </>
  );
};

export default FundFilter;
