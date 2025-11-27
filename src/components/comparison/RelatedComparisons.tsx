import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/types/funds';
import { generateComparisonsFromFunds } from '../../data/services/comparison-service';
import { useAllFunds } from '@/hooks/useFundsQuery';
import CategoryBadge from './CategoryBadge';

interface RelatedComparisonsProps {
  currentFund1: Fund;
  currentFund2: Fund;
  maxComparisons?: number;
}

const RelatedComparisons: React.FC<RelatedComparisonsProps> = ({ 
  currentFund1, 
  currentFund2, 
  maxComparisons = 6 
}) => {
  // Fetch all funds from database
  const { data: allFunds } = useAllFunds();
  
  // Generate all comparisons from database funds
  const allComparisons = allFunds ? generateComparisonsFromFunds(allFunds) : [];
  
  // Filter out the current comparison and find related ones
  const currentSlug = `${[currentFund1.id, currentFund2.id].sort().join('-vs-')}`;
  
  const relatedComparisons = allComparisons
    .filter(comparison => comparison.slug !== currentSlug)
    .filter(comparison => 
      // Include comparisons that involve either of the current funds
      comparison.fund1.id === currentFund1.id || 
      comparison.fund1.id === currentFund2.id ||
      comparison.fund2.id === currentFund1.id || 
      comparison.fund2.id === currentFund2.id ||
      // Or same category as either fund
      comparison.fund1.category === currentFund1.category ||
      comparison.fund1.category === currentFund2.category ||
      comparison.fund2.category === currentFund1.category ||
      comparison.fund2.category === currentFund2.category
    )
    .slice(0, maxComparisons);

  if (relatedComparisons.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-[22px] font-semibold text-foreground mb-6">
        Related Comparisons
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedComparisons.map(comparison => (
          <Link
            key={comparison.slug}
            to={`/compare/${comparison.slug}`}
            className="group bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all duration-200 block"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <CategoryBadge category={comparison.fund1.category || 'Other'} />
              <span className="text-xs text-muted-foreground">vs</span>
              <CategoryBadge category={comparison.fund2.category || 'Other'} />
            </div>
            <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {comparison.fund1.name} vs {comparison.fund2.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedComparisons;