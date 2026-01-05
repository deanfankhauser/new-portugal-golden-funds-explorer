import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Search, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { cn } from '@/lib/utils';

const QuickFilterBar: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current filter values from URL
  const verifiedOnly = searchParams.get('verified') === 'true';
  const minInvestment = searchParams.get('minInvestment') || '';
  const riskLevel = searchParams.get('risk') || '';
  const liquidity = searchParams.get('liquidity') || '';
  const strategy = searchParams.get('category') || '';

  const { results, isSearching } = useGlobalSearch(searchValue);

  // Group results by type
  const groupedResults = useMemo(() => {
    const funds = results.filter(r => r.type === 'fund');
    const managers = results.filter(r => r.type === 'manager');
    const categories = results.filter(r => r.type === 'category');
    return { funds, managers, categories };
  }, [results]);

  // Update URL params when filters change
  const updateFilter = (key: string, value: string | boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === '' || value === false) {
      newParams.delete(key);
    } else if (typeof value === 'boolean') {
      newParams.set(key, value.toString());
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleVerifiedToggle = (checked: boolean) => {
    updateFilter('verified', checked);
  };

  const handleMinInvestmentChange = (value: string) => {
    updateFilter('minInvestment', value === 'all' ? '' : value);
  };

  const handleRiskChange = (value: string) => {
    updateFilter('risk', value === 'all' ? '' : value);
  };

  const handleLiquidityChange = (value: string) => {
    updateFilter('liquidity', value === 'all' ? '' : value);
  };

  const handleStrategyChange = (value: string) => {
    updateFilter('category', value === 'all' ? '' : value);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            const result = results[selectedIndex];
            navigate(result.url);
          }
          setIsOpen(false);
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (url: string) => {
    navigate(url);
    setIsOpen(false);
    setSearchValue('');
  };

  const hasResults = results.length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search Card Container */}
      <div className="bg-card rounded-2xl shadow-lg border border-border/50">
        {/* Search Section */}
        <div className="p-5 sm:p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search funds or managers…"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setIsOpen(e.target.value.length > 0);
                setSelectedIndex(-1);
              }}
              onFocus={() => searchValue.length > 0 && setIsOpen(true)}
              className="pl-12 pr-10 h-14 text-base sm:text-lg rounded-xl border-border/60 bg-background shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all"
              aria-label="Search funds or managers"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
            />
            {searchValue && (
              <button
                onClick={() => {
                  setSearchValue('');
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            {/* Search Results Dropdown */}
            {isOpen && searchValue && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
                role="listbox"
              >
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground">Searching...</div>
                ) : hasResults ? (
                  <div className="py-2">
                    {groupedResults.funds.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Funds</div>
                        {groupedResults.funds.map((fund, index) => (
                          <button
                            key={fund.id}
                            onClick={() => handleResultClick(fund.url)}
                            className={cn(
                              "w-full px-4 py-3 text-left hover:bg-muted/60 transition-colors",
                              selectedIndex === index && "bg-muted/60"
                            )}
                            role="option"
                            aria-selected={selectedIndex === index}
                          >
                            <div className="font-medium text-foreground">{fund.name}</div>
                            <div className="text-sm text-muted-foreground">{fund.subtitle}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    {groupedResults.managers.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Managers</div>
                        {groupedResults.managers.map((manager, index) => (
                          <button
                            key={manager.id}
                            onClick={() => handleResultClick(manager.url)}
                            className={cn(
                              "w-full px-4 py-3 text-left hover:bg-muted/60 transition-colors",
                              selectedIndex === groupedResults.funds.length + index && "bg-muted/60"
                            )}
                            role="option"
                            aria-selected={selectedIndex === groupedResults.funds.length + index}
                          >
                            <div className="font-medium text-foreground">{manager.name}</div>
                            <div className="text-sm text-muted-foreground">{manager.subtitle}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No results found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40" />

        {/* Filters Section */}
        <div className="px-5 sm:px-6 py-4">
          {/* Desktop: Horizontal filter row with dividers */}
          <div className="hidden md:flex items-center justify-center gap-0">
            {/* Verified Checkbox */}
            <div className="flex items-center gap-2 px-4">
              <Checkbox
                id="verified-filter"
                checked={verifiedOnly}
                onCheckedChange={(checked) => handleVerifiedToggle(checked === true)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label 
                htmlFor="verified-filter" 
                className="text-sm font-medium text-foreground cursor-pointer whitespace-nowrap"
              >
                Verified only
              </Label>
            </div>

            <div className="h-5 w-px bg-border/60" />

            {/* Min Investment */}
            <div className="px-2">
              <Select value={minInvestment || 'all'} onValueChange={handleMinInvestmentChange}>
                <SelectTrigger className="border-0 bg-transparent shadow-none h-9 px-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Any investment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any investment</SelectItem>
                  <SelectItem value="100-250">€100K – €250K</SelectItem>
                  <SelectItem value="250-500">€250K – €500K</SelectItem>
                  <SelectItem value="500+">€500K+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-5 w-px bg-border/60" />

            {/* Risk Level */}
            <div className="px-2">
              <Select value={riskLevel || 'all'} onValueChange={handleRiskChange}>
                <SelectTrigger className="border-0 bg-transparent shadow-none h-9 px-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Any risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any risk</SelectItem>
                  <SelectItem value="low">Low risk</SelectItem>
                  <SelectItem value="medium">Medium risk</SelectItem>
                  <SelectItem value="high">High risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-5 w-px bg-border/60" />

            {/* Liquidity/Term */}
            <div className="px-2">
              <Select value={liquidity || 'all'} onValueChange={handleLiquidityChange}>
                <SelectTrigger className="border-0 bg-transparent shadow-none h-9 px-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Any term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any term</SelectItem>
                  <SelectItem value="3-6">3–6 years</SelectItem>
                  <SelectItem value="6-8">6–8 years</SelectItem>
                  <SelectItem value="8-10">8–10 years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-5 w-px bg-border/60" />

            {/* Strategy */}
            <div className="px-2">
              <Select value={strategy || 'all'} onValueChange={handleStrategyChange}>
                <SelectTrigger className="border-0 bg-transparent shadow-none h-9 px-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Any strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any strategy</SelectItem>
                  <SelectItem value="Private Equity">Private Equity</SelectItem>
                  <SelectItem value="Venture Capital">Venture Capital</SelectItem>
                  <SelectItem value="Balanced">Balanced</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile: 2-column grid */}
          <div className="md:hidden space-y-3">
            {/* Verified Checkbox - Full width */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="verified-filter-mobile"
                checked={verifiedOnly}
                onCheckedChange={(checked) => handleVerifiedToggle(checked === true)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label 
                htmlFor="verified-filter-mobile" 
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                Verified only
              </Label>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-2 gap-2">
              <Select value={minInvestment || 'all'} onValueChange={handleMinInvestmentChange}>
                <SelectTrigger className="bg-muted/30 border-border/40 h-10 text-sm">
                  <SelectValue placeholder="Investment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any investment</SelectItem>
                  <SelectItem value="100-250">€100K – €250K</SelectItem>
                  <SelectItem value="250-500">€250K – €500K</SelectItem>
                  <SelectItem value="500+">€500K+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={riskLevel || 'all'} onValueChange={handleRiskChange}>
                <SelectTrigger className="bg-muted/30 border-border/40 h-10 text-sm">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any risk</SelectItem>
                  <SelectItem value="low">Low risk</SelectItem>
                  <SelectItem value="medium">Medium risk</SelectItem>
                  <SelectItem value="high">High risk</SelectItem>
                </SelectContent>
              </Select>

              <Select value={liquidity || 'all'} onValueChange={handleLiquidityChange}>
                <SelectTrigger className="bg-muted/30 border-border/40 h-10 text-sm">
                  <SelectValue placeholder="Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any term</SelectItem>
                  <SelectItem value="3-6">3–6 years</SelectItem>
                  <SelectItem value="6-8">6–8 years</SelectItem>
                  <SelectItem value="8-10">8–10 years</SelectItem>
                </SelectContent>
              </Select>

              <Select value={strategy || 'all'} onValueChange={handleStrategyChange}>
                <SelectTrigger className="bg-muted/30 border-border/40 h-10 text-sm">
                  <SelectValue placeholder="Strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any strategy</SelectItem>
                  <SelectItem value="Private Equity">Private Equity</SelectItem>
                  <SelectItem value="Venture Capital">Venture Capital</SelectItem>
                  <SelectItem value="Balanced">Balanced</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40" />

        {/* CTA Section */}
        <div className="px-5 sm:px-6 py-4 bg-muted/20">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate(`/funds${searchParams.toString() ? `?${searchParams.toString()}` : ''}`)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 rounded-full shadow-sm"
            >
              Browse results
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="font-semibold px-8 rounded-full border-border/60 hover:bg-muted/50"
            >
              <Link to="/compare">Compare funds</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickFilterBar;
