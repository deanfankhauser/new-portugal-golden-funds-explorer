import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Fund } from '../../data/types/funds';
import { getFundsByCategory } from '../../data/services/categories-service';
import { getAllTags } from '../../data/services/tags-service';
import { getTagFallbackCategory } from '../../utils/tagCategoryMapping';
import { tagToSlug } from '@/lib/utils';
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
  
  // Get related tags that have funds
  const relatedTags = useMemo(() => {
    const allTags = getAllTags(allFunds);
    return allTags
      .filter(tag => tag !== tagName)
      .slice(0, 8);
  }, [allFunds, tagName]);
  
  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg shadow-sm border border-border/40 p-10 text-center">
        <h3 className="text-2xl font-semibold mb-3">No funds currently match this filter</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-2">
          No {tagName} funds are currently available. Browse all funds or try another tag.
        </p>
        <p className="text-sm text-muted-foreground">
          Check back later or explore recommended alternatives below.
        </p>
      </div>

      {relatedTags.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Explore Related Tags</h3>
          <div className="flex flex-wrap gap-3">
            {relatedTags.map(tag => (
              <Link 
                key={tag}
                to={`/tags/${tagToSlug(tag)}`}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

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
