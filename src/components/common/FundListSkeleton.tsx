
import React from 'react';
import { Skeleton } from '../ui/skeleton';

const FundListSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="card-modern p-6 sm:p-8 animate-pulse"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Enhanced image skeleton */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-muted to-muted/70 loading-shimmer"></div>
            </div>
            
            {/* Enhanced content skeleton */}
            <div className="flex-1 space-y-4">
              <div className="space-y-3">
                <div className="h-7 bg-gradient-to-r from-muted to-muted/70 rounded-xl w-3/4 loading-shimmer"></div>
                <div className="h-5 bg-gradient-to-r from-muted to-muted/70 rounded-lg w-1/2 loading-shimmer"></div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="h-7 w-20 bg-gradient-to-r from-muted to-muted/70 rounded-full loading-shimmer"></div>
                <div className="h-7 w-24 bg-gradient-to-r from-muted to-muted/70 rounded-full loading-shimmer"></div>
                <div className="h-7 w-16 bg-gradient-to-r from-muted to-muted/70 rounded-full loading-shimmer"></div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
                {Array.from({ length: 4 }).map((_, metricIndex) => (
                  <div key={metricIndex} className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-muted to-muted/70 rounded-lg w-full loading-shimmer"></div>
                    <div className="h-6 bg-gradient-to-r from-muted to-muted/70 rounded-lg w-3/4 loading-shimmer"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FundListSkeleton;
