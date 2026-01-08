import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface USFundsFilterState {
  showConfirmedOnly: boolean;
  includeUnknown: boolean;
  category: string;
  feeRange: string;
  minInvestment: string;
}

interface USFundsFiltersProps {
  filters: USFundsFilterState;
  onFilterChange: (filters: USFundsFilterState) => void;
  totalFunds: number;
  filteredCount: number;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'Private Equity', label: 'Private Equity' },
  { value: 'Venture Capital', label: 'Venture Capital' },
  { value: 'Debt', label: 'Debt' },
  { value: 'Infrastructure', label: 'Infrastructure' },
  { value: 'Clean Energy', label: 'Clean Energy' },
  { value: 'Crypto', label: 'Crypto' },
];

const feeRanges = [
  { value: 'all', label: 'Any Fees' },
  { value: 'low', label: 'Low (<1.5%)' },
  { value: 'medium', label: 'Medium (1.5-2.5%)' },
  { value: 'high', label: 'High (>2.5%)' },
];

const minInvestmentRanges = [
  { value: 'all', label: 'Any Minimum' },
  { value: 'under250k', label: 'Under €250k' },
  { value: '250k-500k', label: '€250k - €500k' },
  { value: 'over500k', label: 'Over €500k' },
];

export const USFundsFilters: React.FC<USFundsFiltersProps> = ({
  filters,
  onFilterChange,
  totalFunds,
  filteredCount
}) => {
  const handleChange = (key: keyof USFundsFilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Filters</span>
        <span className="text-sm text-muted-foreground ml-auto">
          Showing {filteredCount} of {totalFunds} funds
        </span>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* US Eligibility toggles */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">US Eligibility</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="confirmed-only"
                checked={filters.showConfirmedOnly}
                onCheckedChange={(checked) => handleChange('showConfirmedOnly', checked)}
              />
              <Label htmlFor="confirmed-only" className="text-sm text-muted-foreground cursor-pointer">
                Show confirmed only
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="include-unknown"
                checked={filters.includeUnknown}
                onCheckedChange={(checked) => handleChange('includeUnknown', checked)}
                disabled={filters.showConfirmedOnly}
              />
              <Label 
                htmlFor="include-unknown" 
                className={`text-sm cursor-pointer ${filters.showConfirmedOnly ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}
              >
                Include unknown
              </Label>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Category</Label>
          <Select 
            value={filters.category} 
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fee range filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Management Fee</Label>
          <Select 
            value={filters.feeRange} 
            onValueChange={(value) => handleChange('feeRange', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select fee range" />
            </SelectTrigger>
            <SelectContent>
              {feeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Minimum investment filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Minimum Investment</Label>
          <Select 
            value={filters.minInvestment} 
            onValueChange={(value) => handleChange('minInvestment', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select minimum" />
            </SelectTrigger>
            <SelectContent>
              {minInvestmentRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reset filters */}
      {(filters.showConfirmedOnly || !filters.includeUnknown || filters.category !== 'all' || filters.feeRange !== 'all' || filters.minInvestment !== 'all') && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onFilterChange({
              showConfirmedOnly: false,
              includeUnknown: true,
              category: 'all',
              feeRange: 'all',
              minInvestment: 'all'
            })}
          >
            Reset all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default USFundsFilters;
