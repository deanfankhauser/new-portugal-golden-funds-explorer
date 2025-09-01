
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Fund, FundTag } from '../../data/funds';
import { getGVEligibleFunds } from '../../data/services/gv-eligibility-service';

interface ResultsHeaderProps {
  filteredFunds: Fund[];
  selectedTags: FundTag[];
  searchQuery: string;
  setSelectedTags: (tags: FundTag[]) => void;
  setSearchQuery: (query: string) => void;
  showOnlyGVEligible: boolean;
  setShowOnlyGVEligible: (show: boolean) => void;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  filteredFunds,
  selectedTags,
  searchQuery,
  setSelectedTags,
  setSearchQuery,
  showOnlyGVEligible,
  setShowOnlyGVEligible
}) => {
  const gvEligibleFunds = getGVEligibleFunds(filteredFunds);
  
  return (
    <div className="space-y-4 mb-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 mb-2">
          <strong>Showing GV-eligible funds by default.</strong> Toggle to view non-GV alternatives.
        </p>
        <div className="flex items-center gap-2">
          <Switch
            checked={showOnlyGVEligible}
            onCheckedChange={setShowOnlyGVEligible}
            id="gv-filter"
          />
          <label htmlFor="gv-filter" className="text-sm text-blue-600 cursor-pointer">
            {showOnlyGVEligible ? 'GV Eligible Only' : 'Show All Funds'}
          </label>
        </div>
      </div>
      
      <div className="flex justify-between items-center p-4 bg-card rounded-lg border border-border">
        <div>
          <p className="text-foreground font-semibold text-lg" role="status">
            {filteredFunds.length} fund{filteredFunds.length !== 1 ? 's' : ''} found
          </p>
          <p className="text-sm text-muted-foreground">
            {gvEligibleFunds.length} Golden Visa eligible
            {gvEligibleFunds.length !== filteredFunds.length && 
              `, ${filteredFunds.length - gvEligibleFunds.length} not eligible`}
          </p>
        </div>
        {(selectedTags.length > 0 || searchQuery || !showOnlyGVEligible) && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedTags([]);
              setSearchQuery('');
              setShowOnlyGVEligible(true);
            }}
            className="text-sm"
          >
            Reset all filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResultsHeader;
