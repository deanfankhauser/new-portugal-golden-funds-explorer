import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Check, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { GlobalSearchDropdown } from '@/components/GlobalSearchDropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface QuickFilterBarProps {
  onBrowseResults: () => void;
}

const QuickFilterBar: React.FC<QuickFilterBarProps> = ({ onBrowseResults }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, isSearching } = useGlobalSearch(searchValue);

  // Filter states
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minInvestment, setMinInvestment] = useState<string | null>(null);
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [liquidity, setLiquidity] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<string | null>(null);

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

  const FilterChip: React.FC<{
    label: string;
    value: string | null;
    options: { label: string; value: string }[];
    onChange: (value: string | null) => void;
  }> = ({ label, value, options, onChange }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-1 h-9 px-3 text-sm font-medium border-border bg-card hover:bg-muted",
            value && "bg-primary/10 border-primary/30 text-primary"
          )}
        >
          <span>{value || label}</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 bg-popover">
        <DropdownMenuItem
          onClick={() => onChange(null)}
          className="cursor-pointer"
        >
          <span className="text-muted-foreground">Any {label.toLowerCase()}</span>
        </DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="cursor-pointer flex items-center justify-between"
          >
            <span>{option.label}</span>
            {value === option.label && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div ref={searchRef} className="relative max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search funds or managers..."
            value={searchValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => searchValue.trim() && setIsOpen(true)}
            className="pl-12 pr-12 h-14 text-lg bg-card border-border rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
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

      {/* Quick Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {/* Verified Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={cn(
            "gap-1.5 h-9 px-3 text-sm font-medium border-border bg-card hover:bg-muted",
            verifiedOnly && "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
          )}
        >
          {verifiedOnly && <Check className="h-3.5 w-3.5" />}
          <span>Verified</span>
        </Button>

        <FilterChip
          label="Investment"
          value={minInvestment}
          options={[
            { label: '€100K–€250K', value: '100k-250k' },
            { label: '€250K–€500K', value: '250k-500k' },
            { label: '€500K+', value: '500k+' },
          ]}
          onChange={setMinInvestment}
        />

        <FilterChip
          label="Risk"
          value={riskLevel}
          options={[
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ]}
          onChange={setRiskLevel}
        />

        <FilterChip
          label="Liquidity"
          value={liquidity}
          options={[
            { label: '3–6 years', value: '3-6' },
            { label: '6–8 years', value: '6-8' },
            { label: '8–10 years', value: '8-10' },
          ]}
          onChange={setLiquidity}
        />

        <FilterChip
          label="Strategy"
          value={strategy}
          options={[
            { label: 'Private Equity', value: 'private-equity' },
            { label: 'Venture Capital', value: 'venture-capital' },
            { label: 'Balanced', value: 'balanced' },
            { label: 'Other', value: 'other' },
          ]}
          onChange={setStrategy}
        />
      </div>
    </div>
  );
};

export default QuickFilterBar;
