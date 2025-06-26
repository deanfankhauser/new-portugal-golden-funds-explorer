
import React from 'react';
import { Skeleton } from '../ui/skeleton';

const FundListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Image skeleton */}
            <div className="flex-shrink-0">
              <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg" />
            </div>
            
            {/* Content skeleton */}
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FundListSkeleton;
