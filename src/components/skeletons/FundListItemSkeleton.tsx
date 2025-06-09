
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const FundListItemSkeleton: React.FC = () => {
  return (
    <Card className="border rounded-lg bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 md:w-48">
            <Skeleton className="w-full h-32 rounded-lg" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <Skeleton className="h-6 w-3/4" />
            </div>
            
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center">
                <Skeleton className="w-4 h-4 mr-2" />
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              
              <div className="flex items-center">
                <Skeleton className="w-4 h-4 mr-2" />
                <div>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              
              <div className="flex items-center">
                <Skeleton className="w-4 h-4 mr-2" />
                <div>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              
              <div className="flex items-center">
                <Skeleton className="w-4 h-4 mr-2" />
                <div>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 justify-center min-w-[160px]">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundListItemSkeleton;
