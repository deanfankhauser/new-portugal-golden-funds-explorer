
import React from 'react';
import { PieChart } from 'lucide-react';
import { GeographicAllocation as GeoAllocation } from '../../data/funds';

interface GeographicAllocationProps {
  allocations?: GeoAllocation[];
  formatPercentage: (value: number) => string;
}

const GeographicAllocation: React.FC<GeographicAllocationProps> = ({ allocations, formatPercentage }) => {
  if (!allocations || allocations.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 p-5 bg-gray-50 rounded-lg">
      <div className="flex items-center mb-4">
        <PieChart className="w-5 h-5 mr-2 text-[#EF4444]" />
        <h2 className="text-2xl font-bold">Geographic Allocation</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {allocations.map((allocation, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700">{allocation.region}</h3>
            <p className="text-2xl font-bold text-[#EF4444]">{formatPercentage(allocation.percentage)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeographicAllocation;
