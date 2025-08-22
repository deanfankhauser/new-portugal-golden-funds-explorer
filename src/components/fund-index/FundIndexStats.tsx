
import React from 'react';
import { FundScore } from '../../services/fundScoringService';

interface FundIndexStatsProps {
  paginatedCount: number;
  filteredCount: number;
  totalCount: number;
}

const FundIndexStats: React.FC<FundIndexStatsProps> = ({
  paginatedCount,
  filteredCount,
  totalCount
}) => {
  return (
    <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
      Showing <span className="font-medium text-foreground">{paginatedCount}</span> of <span className="font-medium text-foreground">{filteredCount}</span> funds 
      (<span className="font-medium text-foreground">{totalCount}</span> total)
    </div>
  );
};

export default FundIndexStats;
