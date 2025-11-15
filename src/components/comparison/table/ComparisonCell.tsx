
import React from 'react';
import { Trophy } from 'lucide-react';

interface ComparisonCellProps {
  value: React.ReactNode;
  highlight?: boolean;
  isBest?: boolean;
}

const ComparisonCell: React.FC<ComparisonCellProps> = ({ value, highlight = false, isBest = false }) => {
  return (
    <td className={`py-3 px-4 ${highlight ? "bg-success/10" : ""} ${isBest ? "bg-success/20" : ""}`}>
      {isBest ? (
        <div className="flex items-center gap-2">
          <span className="flex-1">{value}</span>
          <div className="flex items-center gap-1 text-success text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Best</span>
          </div>
        </div>
      ) : (
        value
      )}
    </td>
  );
};

export default ComparisonCell;
