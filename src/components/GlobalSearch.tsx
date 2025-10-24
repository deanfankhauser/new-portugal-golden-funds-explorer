import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const GlobalSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState('');

  // Initialize from URL params
  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchValue(query);
  }, [searchParams]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    
    // Navigate to homepage if not there
    if (location.pathname !== '/') {
      navigate(`/?search=${encodeURIComponent(value)}`);
    } else {
      // Update URL params
      const newParams = new URLSearchParams(searchParams);
      if (value.trim()) {
        newParams.set('search', value);
      } else {
        newParams.delete('search');
      }
      setSearchParams(newParams);
    }
  };

  const clearSearch = () => {
    setSearchValue('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  return (
    <div className="relative w-full md:w-80">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-background/60" />
        <Input
          type="text"
          placeholder="Search funds..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 bg-background/10 border-background/20 text-background placeholder:text-background/60 focus:bg-background/20"
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
    </div>
  );
};

export default GlobalSearch;