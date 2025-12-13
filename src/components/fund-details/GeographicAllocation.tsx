
import React from 'react';
import { Globe } from 'lucide-react';
import { GeographicAllocation as GeoAllocation } from '../../data/types/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GeographicAllocationProps {
  allocations?: GeoAllocation[];
  formatPercentage: (value: number) => string;
}

const GeographicAllocation: React.FC<GeographicAllocationProps> = ({ allocations, formatPercentage }) => {
  if (!allocations || allocations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-card border border-border/40 rounded-2xl shadow-sm">
      <CardContent className="p-10">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-8">Geographic Allocation</h2>
        
        <div className="flex flex-col gap-4">
          {allocations.map((allocation, index) => (
            <div 
              key={allocation.region}
              className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors"
            >
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                <Globe className="h-[18px] w-[18px] text-muted-foreground" />
                {allocation.region}
              </span>
              <span className="text-[15px] font-semibold text-foreground">{formatPercentage(allocation.percentage)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GeographicAllocation;
