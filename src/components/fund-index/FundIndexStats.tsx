
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
    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
      Showing <span className="font-medium">{paginatedCount}</span> of <span className="font-medium">{filteredCount}</span> funds 
      (<span className="font-medium">{totalCount}</span> total)
    </div>
  );
};

export default FundIndexStats;
