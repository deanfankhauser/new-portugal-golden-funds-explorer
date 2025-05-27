
import React, { useState } from 'react';
import { FundTag, getAllTags } from '../data/funds';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PasswordDialog from './PasswordDialog';

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
  
  const toggleTag = (tag: FundTag) => {
    if (!isAuthenticated) {
      setShowPasswordDialog(true);
      return;
    }
    
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSearchChange = (value: string) => {
    if (!isAuthenticated && value.trim()) {
      setShowPasswordDialog(true);
      return;
    }
    setSearchQuery(value);
  };

  const clearFilters = () => {
    if (!isAuthenticated) {
      setShowPasswordDialog(true);
      return;
    }
    setSelectedTags([]);
    setSearchQuery('');
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter Funds</h2>
        
        <div className="mb-4">
          <label htmlFor="search" className="block mb-1 text-sm font-medium">Search</label>
          <Input
            id="search"
            type="text"
            placeholder={isAuthenticated ? "Search funds..." : "Client access required for search"}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
            disabled={!isAuthenticated}
          />
          {!isAuthenticated && (
            <p className="text-xs text-gray-500 mt-1">
              Enter client password to use search functionality
            </p>
          )}
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium">Filter by Tags</label>
          {!isAuthenticated && (
            <p className="text-xs text-gray-500 mb-2">
              Client access required for advanced filtering
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
                disabled={!isAuthenticated}
                className={selectedTags.includes(tag) ? 
                  "bg-[#EF4444] hover:bg-[#EF4444]/90 text-white" : 
                  "border-gray-300 hover:bg-[#f0f0f0] text-gray-700 hover:text-gray-800 disabled:opacity-50"}
              >
                {tag}
              </Button>
            ))}
          </div>
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
              disabled={!isAuthenticated}
              className="text-sm text-[#EF4444] hover:text-[#EF4444] hover:bg-[#f0f0f0] flex items-center disabled:opacity-50"
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
