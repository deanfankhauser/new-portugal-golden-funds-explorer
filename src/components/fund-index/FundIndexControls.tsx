
import React from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import { FundScore } from '../../services/fundScoringService';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

interface FundIndexControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredScores: FundScore[];
  showOnlyVerified: boolean;
  onShowOnlyVerifiedChange: (value: boolean) => void;
}

const FundIndexControls: React.FC<FundIndexControlsProps> = ({
  searchTerm,
  onSearchChange,
  showOnlyVerified,
  onShowOnlyVerifiedChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search funds, managers, or categories..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        <Label htmlFor="index-verified-only" className="cursor-pointer font-medium whitespace-nowrap">
          Verified Only
        </Label>
        <Switch
          id="index-verified-only"
          checked={showOnlyVerified}
          onCheckedChange={onShowOnlyVerifiedChange}
        />
      </div>
    </div>
  );
};

export default FundIndexControls;
