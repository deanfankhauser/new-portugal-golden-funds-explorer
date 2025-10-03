
import React from 'react';
import { Globe } from 'lucide-react';
import { GeographicAllocation as GeoAllocation } from '../../data/funds';
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
    <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Geographic Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {allocations.map((allocation, index) => (
            <div 
              key={allocation.region} 
              className={`flex items-center justify-between py-2 ${index !== allocations.length - 1 ? 'border-b' : ''}`}
            >
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {allocation.region}
              </span>
              <span className="text-sm font-medium">{formatPercentage(allocation.percentage)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GeographicAllocation;
