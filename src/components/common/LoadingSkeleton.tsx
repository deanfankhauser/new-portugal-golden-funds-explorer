import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Page-specific loading skeletons
export const FundDetailsLoader = () => (
  <div className="container mx-auto px-4 max-w-7xl animate-fade-in">
    <div className="space-y-8">
      {/* Breadcrumb skeleton */}
      <Skeleton className="h-4 w-64" />
      
      {/* Fund header skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-80" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      
      {/* Fund metrics skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ))}
      </div>
      
      {/* Tabs skeleton */}
      <div className="space-y-6">
        <div className="flex space-x-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  </div>
);

export const FundIndexLoader = () => (
  <div className="container mx-auto px-4 animate-fade-in">
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      
      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20" />
        ))}
      </div>
      
      {/* Table skeleton */}
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-4 p-4 border-b">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 p-4">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ComparisonLoader = () => (
  <div className="container mx-auto px-4 animate-fade-in">
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const PageLoader = () => (
  <div className="container mx-auto px-4 py-8 animate-fade-in">
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  </div>
);


export const ROICalculatorLoader = () => (
  <div className="container mx-auto px-4 py-8 animate-fade-in">
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <Skeleton className="h-10 w-96 mx-auto" />
        <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);