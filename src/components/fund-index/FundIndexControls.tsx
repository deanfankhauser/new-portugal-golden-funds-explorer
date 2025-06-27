
import React from 'react';
import { Search } from 'lucide-react';
import { FundScore } from '../../services/fundScoringService';
import { Input } from '../ui/input';

interface FundIndexControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredScores: FundScore[];
}

const FundIndexControls: React.FC<FundIndexControlsProps> = ({
  searchTerm,
  onSearchChange
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
    </div>
  );
};

export default FundIndexControls;
