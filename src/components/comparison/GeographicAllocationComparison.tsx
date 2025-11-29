import React from 'react';
import { Fund } from '@/data/types/funds';

interface GeographicAllocationComparisonProps {
  fund1: Fund;
  fund2: Fund;
}

const GeographicAllocationComparison: React.FC<GeographicAllocationComparisonProps> = ({ fund1, fund2 }) => {
  const hasAllocation1 = fund1.geographicAllocation && fund1.geographicAllocation.length > 0;
  const hasAllocation2 = fund2.geographicAllocation && fund2.geographicAllocation.length > 0;

  if (!hasAllocation1 && !hasAllocation2) {
    return null;
  }

  const AllocationBars = ({ allocations, color, label }: { allocations: any[]; color: string; label: string }) => (
    <div>
      <div className="text-sm font-medium text-muted-foreground mb-4">
        {label}
      </div>
      <div className="space-y-3">
        {allocations.map((allocation, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-28 text-[13px] text-muted-foreground">
              {allocation.region}
            </div>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${color} rounded-full transition-all duration-500`}
                style={{ width: `${allocation.percentage}%` }}
              />
            </div>
            <div className="w-10 text-[13px] font-medium text-foreground text-right">
              {allocation.percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-2xl border border-border p-7 mb-8">
      <h3 className="text-base font-semibold text-foreground mb-6">
        Geographic Allocation
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {hasAllocation1 ? (
          <AllocationBars 
            allocations={fund1.geographicAllocation!} 
            color="bg-accent"
            label={fund1.name}
          />
        ) : (
          <div className="text-sm text-muted-foreground">
            {fund1.name}: Not disclosed
          </div>
        )}
        
        {hasAllocation2 ? (
          <AllocationBars 
            allocations={fund2.geographicAllocation!} 
            color="bg-primary"
            label={fund2.name}
          />
        ) : (
          <div className="text-sm text-muted-foreground">
            {fund2.name}: Not disclosed
          </div>
        )}
      </div>
    </div>
  );
};

export default GeographicAllocationComparison;
