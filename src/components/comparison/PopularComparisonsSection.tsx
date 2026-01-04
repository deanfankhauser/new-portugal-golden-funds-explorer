import React from 'react';
import { Fund } from '../../data/types/funds';
import CategoryBadge from './CategoryBadge';

interface ComparisonPair {
  fund1: Fund;
  fund2: Fund;
  slug: string;
}

interface PopularComparisonsSectionProps {
  comparisons: ComparisonPair[];
}

const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
};

const PopularComparisonsSection: React.FC<PopularComparisonsSectionProps> = ({ comparisons }) => {
  if (comparisons.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">Popular Fund Comparisons</h2>
      <p className="text-muted-foreground mb-6">
        Explore detailed side-by-side comparisons of Portugal Golden Visa investment funds. 
        Compare fees, returns, risk levels, and investment requirements to find the best fund for your needs.
      </p>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {comparisons.map((comparison) => (
          <a
            key={comparison.slug}
            href={`/compare/${comparison.slug}`}
            className="block p-4 bg-card border rounded-lg hover:shadow-md transition-shadow group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
                    {comparison.fund1.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {comparison.fund1.managerName}
                  </p>
                </div>
                <span className="text-muted-foreground text-xs font-medium px-2">vs</span>
                <div className="flex-1 min-w-0 text-right">
                  <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
                    {comparison.fund2.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {comparison.fund2.managerName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-1">
                  {comparison.fund1.category && (
                    <CategoryBadge category={comparison.fund1.category} />
                  )}
                </div>
                <div className="flex gap-1">
                  {comparison.fund2.category && (
                    <CategoryBadge category={comparison.fund2.category} />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                <span>Min: {formatCurrency(comparison.fund1.minimumInvestment)}</span>
                <span>Min: {formatCurrency(comparison.fund2.minimumInvestment)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <a 
          href="/comparisons" 
          className="text-primary hover:underline font-medium"
        >
          View all fund comparisons →
        </a>
      </div>
    </section>
  );
};

export default PopularComparisonsSection;
