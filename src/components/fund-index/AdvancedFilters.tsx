
import React, { useState } from 'react';
import { Filter, X, Lock, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useAuth } from '../../contexts/AuthContext';
import PasswordDialog from '../PasswordDialog';

export interface FilterOptions {
  category: string;
  fundStatus: string;
  minInvestmentRange: string;
  managementFeeRange: string;
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle
}) => {
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  const activeFiltersCount = Object.values(filters).filter(value => value !== 'all').length;
  
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    if (!isAuthenticated) {
      setShowPasswordDialog(true);
      return;
    }
    
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleUnlockClick = () => {
    setShowPasswordDialog(true);
  };

  const handleClearFilters = () => {
    if (!isAuthenticated) {
      setShowPasswordDialog(true);
      return;
    }
    onClearFilters();
  };

  // Show gated content for non-authenticated users
  if (!isAuthenticated) {
    return (
      <>
        <Collapsible open={isOpen} onOpenChange={onToggle}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
                <Lock className="h-4 w-4 text-gray-400" />
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <Card className="mt-4 relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  Filter Options
                  <Lock className="h-4 w-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                {/* Blurred preview */}
                <div className="filter blur-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <div className="h-10 bg-gray-100 rounded border"></div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fund Status</label>
                      <div className="h-10 bg-gray-100 rounded border"></div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Minimum Investment</label>
                      <div className="h-10 bg-gray-100 rounded border"></div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Management Fee</label>
                      <div className="h-10 bg-gray-100 rounded border"></div>
                    </div>
                  </div>
                </div>
                
                {/* Overlay with unlock button */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <Filter className="w-8 h-8 text-[#EF4444] mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Advanced Fund Filters</h3>
                    <p className="text-sm text-gray-600 mb-4 max-w-xs">
                      Filter by category, status, investment amounts, and fee structures
                    </p>
                    <Button 
                      onClick={handleUnlockClick}
                      className="bg-[#EF4444] hover:bg-[#EF4444]/90"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Access Advanced Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        <PasswordDialog 
          open={showPasswordDialog}
          onOpenChange={setShowPasswordDialog}
        />
      </>
    );
  }

  // Show full content for authenticated users
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>
        
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>
      
      <CollapsibleContent>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Filter Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Venture Capital">Venture Capital</SelectItem>
                    <SelectItem value="Private Equity">Private Equity</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Debt">Debt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fund Status</label>
                <Select
                  value={filters.fundStatus}
                  onValueChange={(value) => handleFilterChange('fundStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Closing Soon">Closing Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Investment</label>
                <Select
                  value={filters.minInvestmentRange}
                  onValueChange={(value) => handleFilterChange('minInvestmentRange', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Amounts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Amounts</SelectItem>
                    <SelectItem value="0-250000">€0 - €250k</SelectItem>
                    <SelectItem value="250000-350000">€250k - €350k</SelectItem>
                    <SelectItem value="350000-500000">€350k - €500k</SelectItem>
                    <SelectItem value="500000+">€500k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Management Fee</label>
                <Select
                  value={filters.managementFeeRange}
                  onValueChange={(value) => handleFilterChange('managementFeeRange', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Fees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fees</SelectItem>
                    <SelectItem value="0-1">0% - 1%</SelectItem>
                    <SelectItem value="1-1.5">1% - 1.5%</SelectItem>
                    <SelectItem value="1.5-2">1.5% - 2%</SelectItem>
                    <SelectItem value="2+">2%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AdvancedFilters;
