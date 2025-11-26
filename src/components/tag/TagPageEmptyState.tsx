import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Fund } from '../../data/types/funds';
import { getFundsByCategory } from '../../data/services/categories-service';
import { getTagFallbackCategory } from '../../utils/tagCategoryMapping';
import FundCard from '../FundCard';

interface TagPageEmptyStateProps {
  tagName: string;
  allFunds: Fund[];
}

const TagPageEmptyState = ({ tagName, allFunds }: TagPageEmptyStateProps) => {
  const navigate = useNavigate();
  
  // Get fallback category and fetch alternative funds
  const fallbackCategory = getTagFallbackCategory(tagName);
  const alternativeFunds = useMemo(() => {
    const categoryFunds = getFundsByCategory(allFunds, fallbackCategory as any);
    return categoryFunds.slice(0, 5); // Show top 5 alternatives
  }, [allFunds, fallbackCategory]);
  
  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg shadow-sm border border-border/40 p-10 text-center">
        <h3 className="text-2xl font-semibold mb-3">No funds currently available</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-2">
          Currently, no {tagName} funds are open for subscription.
        </p>
        <p className="text-sm text-muted-foreground">
          Check back later or explore recommended alternatives below.
        </p>
      </div>

      {alternativeFunds.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Recommended Alternatives</h3>
          <p className="text-muted-foreground mb-6">
            Browse these {fallbackCategory} funds as alternatives:
          </p>
          <div className="grid grid-cols-1 gap-6">
            {alternativeFunds.map(fund => (
              <FundCard key={fund.id} fund={fund} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate('/')}
              size="lg"
              variant="outline"
            >
              Browse All Funds
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagPageEmptyState;
