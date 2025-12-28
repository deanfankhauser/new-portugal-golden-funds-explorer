import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const FundCardSkeleton: React.FC = () => (
  <Card className="p-5 animate-pulse">
    <div className="flex flex-col gap-4">
      {/* Header with logo and title */}
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-4 py-3 border-y border-border">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center space-y-2">
            <Skeleton className="h-3 w-20 mx-auto" />
            <Skeleton className="h-5 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Fees section */}
      <div className="flex gap-6">
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  </Card>
);

export const QuizResultsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Preferences summary skeleton */}
      <Card className="p-6 bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
      </Card>

      {/* Results header skeleton */}
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-80 mx-auto" />
      </div>

      {/* Fund cards skeleton */}
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <FundCardSkeleton key={i} />
        ))}
      </div>

      {/* Action buttons skeleton */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
};
