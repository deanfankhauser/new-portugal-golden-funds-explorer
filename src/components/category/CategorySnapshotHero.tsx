import React from 'react';
import { TrendingUp, Euro, Clock } from 'lucide-react';
import { calculateCategoryStatistics } from '../../utils/categoryStatistics';
import { getReturnTargetNumbers } from '../../utils/returnTarget';
import { Fund } from '../../data/types/funds';
import { pluralize } from '../../utils/textHelpers';

interface CategorySnapshotHeroProps {
  categoryName: string;
  funds: Fund[];
}

const CategorySnapshotHero: React.FC<CategorySnapshotHeroProps> = ({ categoryName, funds }) => {
  const stats = calculateCategoryStatistics(funds);

  const formatCurrency = (amount: number | null): string => {
    if (amount === null) return 'Not disclosed';
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    }
    return `€${(amount / 1000).toFixed(0)}K`;
  };

  const formatReturn = (rate: number | null): string => {
    if (rate === null) return 'Not disclosed';
    return `${rate.toFixed(1)}% p.a.`;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-8 mb-8">
      {/* Title Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
          {categoryName} Golden Visa Investment Funds
        </h1>
        <p className="text-lg text-muted-foreground">
          Compare {stats.totalCount} {categoryName} investment {pluralize(stats.totalCount, 'fund')} for Golden Visa applications.
        </p>
      </div>

    </div>
  );
};

export default CategorySnapshotHero;
