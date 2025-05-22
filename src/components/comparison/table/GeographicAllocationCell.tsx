
import React from 'react';
import { GeographicAllocation } from '../../../data/funds';
import ComparisonCell from './ComparisonCell';

interface GeographicAllocationCellProps {
  allocations?: GeographicAllocation[];
  highlight?: boolean;
}

const GeographicAllocationCell: React.FC<GeographicAllocationCellProps> = ({ 
  allocations,
  highlight = false
}) => {
  const content = allocations && allocations.length > 0 ? (
    <div className="space-y-1">
      {allocations.map((allocation, index) => (
        <div key={index}>
          {allocation.region}: {allocation.percentage}%
        </div>
      ))}
    </div>
  ) : "N/A";

  return <ComparisonCell value={content} highlight={highlight} />;
};

export default GeographicAllocationCell;
