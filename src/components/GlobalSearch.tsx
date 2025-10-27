import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { GlobalSearchDropdown } from './GlobalSearchDropdown';

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, isSearching } = useGlobalSearch(searchValue);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    setIsOpen(value.trim().length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          navigate(results[selectedIndex].url);
          handleResultClick();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setSearchValue('');
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setSearchValue('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full md:w-96 lg:w-[500px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-background/60" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search funds, categories, managers..."
          value={searchValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchValue.trim() && setIsOpen(true)}
          className="pl-10 pr-10 bg-background/10 border-background/20 text-background placeholder:text-background/60 focus:bg-background/20 h-10 md:h-11"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-background/60 hover:text-background hover:bg-background/20"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <GlobalSearchDropdown
          results={results}
          isSearching={isSearching}
          onResultClick={handleResultClick}
          selectedIndex={selectedIndex}
        />
      )}
    </div>
  );
};

export default GlobalSearch;