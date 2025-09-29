
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp } from 'lucide-react';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { getReturnTargetDisplay } from '../utils/returnTarget';

const RecentlyViewedFunds = () => {
  const { recentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="border-t border-border pt-6">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
        <Clock size={18} className="text-primary" />
        Recently Viewed Funds
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {recentlyViewed.map((fund) => (
          <Link
            key={fund.id}
            to={`/${fund.id}`}
            className="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-shadow group"
          >
            <h4 className="font-medium text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {fund.name}
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min Investment</span>
                <span className="font-medium">{formatCurrency(fund.minimumInvestment)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Target Annual Return</span>
                <span className="font-medium flex items-center gap-1">
                  <TrendingUp size={12} />
                  {getReturnTargetDisplay(fund)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {fund.managerName}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedFunds;
