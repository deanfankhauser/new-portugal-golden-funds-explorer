
import React from 'react';
import { PieChart } from 'lucide-react';
import { GeographicAllocation as GeoAllocation } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";

interface GeographicAllocationProps {
  allocations?: GeoAllocation[];
  formatPercentage: (value: number) => string;
}

const GeographicAllocation: React.FC<GeographicAllocationProps> = ({ allocations, formatPercentage }) => {
  if (!allocations || allocations.length === 0) {
    return null;
  }

  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-5">
          <PieChart className="w-5 h-5 mr-2 text-accent" />
          <h2 className="text-xl font-bold text-foreground">Geographic Allocation</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allocations.map((allocation) => (
            <div key={allocation.region} className="bg-muted/50 p-4 rounded-lg border border-border">
              <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">{allocation.region}</h3>
              <p className="text-2xl font-bold text-accent mt-1">{formatPercentage(allocation.percentage)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GeographicAllocation;
