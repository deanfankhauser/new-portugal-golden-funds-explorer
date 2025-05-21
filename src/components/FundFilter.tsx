
import React, { useState } from 'react';
import { FundTag, getAllTags } from '../data/funds';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

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
  
  const toggleTag = (tag: FundTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Funds</h2>
      
      <div className="mb-4">
        <label htmlFor="search" className="block mb-1 text-sm font-medium">Search</label>
        <Input
          id="search"
          type="text"
          placeholder="Search funds..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block mb-2 text-sm font-medium">Filter by Tags</label>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTag(tag)}
              className={selectedTags.includes(tag) ? "bg-portugal-blue hover:bg-portugal-darkblue" : ""}
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
            className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FundFilter;
