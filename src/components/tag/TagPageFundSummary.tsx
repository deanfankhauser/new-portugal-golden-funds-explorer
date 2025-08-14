
import React from 'react';
import { Fund } from '../../data/types/funds';
import { DateManagementService } from '../../services/dateManagementService';
import { Calendar } from 'lucide-react';

interface TagPageFundSummaryProps {
  count: number;
  tagName: string;
  funds?: Fund[];
}

const TagPageFundSummary = ({ count, tagName, funds = [] }: TagPageFundSummaryProps) => {
  // Calculate data freshness for this tag
  const calculateTagFreshness = () => {
    if (funds.length === 0) return null;
    
    const freshnessCounts = funds.reduce((acc, fund) => {
      const contentDates = DateManagementService.getFundContentDates(fund);
      const age = DateManagementService.getContentAge(contentDates.dataLastVerified);
      
      if (age <= 7) acc.fresh++;
      else if (age <= 30) acc.recent++;
      else acc.stale++;
      
      return acc;
    }, { fresh: 0, recent: 0, stale: 0 });

    return freshnessCounts;
  };

  const freshness = calculateTagFreshness();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex-1">
        <p className="text-gray-600">
          <span itemProp="numberOfItems">{count}</span> fund{count !== 1 ? 's' : ''} tagged with <span className="font-semibold">{tagName}</span>
        </p>
        {freshness && (
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Data:</span>
            {freshness.fresh > 0 && (
              <span className="text-green-600">{freshness.fresh} fresh</span>
            )}
            {freshness.recent > 0 && (
              <span className="text-yellow-600">{freshness.recent} recent</span>
            )}
            {freshness.stale > 0 && (
              <span className="text-red-600">{freshness.stale} need review</span>
            )}
          </div>
        )}
      </div>
      <div className="text-sm text-gray-500">
        Sorted by relevance
      </div>
    </div>
  );
};

export default TagPageFundSummary;
