
import React from 'react';
import { Trophy } from 'lucide-react';

interface ComparisonCellProps {
  value: React.ReactNode;
  highlight?: boolean;
  isBest?: boolean;
}

const ComparisonCell: React.FC<ComparisonCellProps> = ({ value, highlight = false, isBest = false }) => {
  return (
    <td className={`py-4 px-4 ${highlight ? "bg-success/5" : ""} ${isBest ? "bg-success/10" : ""}`}>
      {isBest ? (
        <div className="flex items-center gap-2">
          <span className="flex-1 text-sm">{value}</span>
          <div className="flex items-center gap-1 text-success text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Best</span>
          </div>
        </div>
      ) : (
        <span className="text-sm">{value}</span>
      )}
    </td>
  );
};

export default ComparisonCell;
