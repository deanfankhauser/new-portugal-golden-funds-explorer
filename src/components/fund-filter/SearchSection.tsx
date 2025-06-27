
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { analytics } from '../../utils/analytics';

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAuthRequired: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  setSearchQuery,
  onAuthRequired
}) => {
  const { isAuthenticated } = useAuth();
  const [searchFocus, setSearchFocus] = useState(false);

  const handleSearchClick = () => {
    if (!isAuthenticated) {
      onAuthRequired();
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

  return (
    <div className="space-y-3">
      <label htmlFor="search" className="block text-sm font-semibold text-gray-700">
        Search Funds
      </label>
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
          searchFocus ? 'text-primary' : 'text-gray-400'
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
              : 'border-gray-200 hover:border-gray-300'
          } ${!isAuthenticated ? 'cursor-pointer' : ''}`}
          readOnly={!isAuthenticated}
        />
      </div>
    </div>
  );
};

export default SearchSection;
