
import React from 'react';
import { Fund } from '../../data/types/funds';
import { DateManagementService } from '../../services/dateManagementService';
import { Calendar } from 'lucide-react';

interface CategoryPageFundSummaryProps {
  count: number;
  categoryName: string;
  funds?: Fund[];
}

const CategoryPageFundSummary: React.FC<CategoryPageFundSummaryProps> = ({ count, categoryName, funds = [] }) => {
  // Calculate data freshness for this category
  const calculateCategoryFreshness = () => {
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

  const freshness = calculateCategoryFreshness();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-card p-6 rounded-xl border border-border">
      <div className="flex-1">
        <p className="text-muted-foreground">
          <span itemProp="numberOfItems">{count}</span> fund{count !== 1 ? 's' : ''} in <span className="font-semibold">{categoryName}</span> category
        </p>
        {freshness && (
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Data:</span>
            {freshness.fresh > 0 && (
              <span className="text-success">{freshness.fresh} fresh</span>
            )}
            {freshness.recent > 0 && (
              <span className="text-warning">{freshness.recent} recent</span>
            )}
            {freshness.stale > 0 && (
              <span className="text-destructive">{freshness.stale} need review</span>
            )}
          </div>
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        Sorted by relevance
      </div>
    </div>
  );
};

export default CategoryPageFundSummary;
