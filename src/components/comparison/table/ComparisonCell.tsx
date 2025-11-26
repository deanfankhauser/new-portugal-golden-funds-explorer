
import React from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonCellProps {
  value: React.ReactNode;
  highlight?: boolean;
  isBest?: boolean;
}

const ComparisonCell: React.FC<ComparisonCellProps> = ({ value, highlight = false, isBest = false }) => {
  return (
    <td className={cn(
      "py-4 px-4",
      highlight && "bg-success/5",
      isBest && "bg-green-50"
    )}>
      {isBest ? (
        <div className="flex items-center gap-2">
          <span className="flex-1 text-sm font-medium text-foreground">{value}</span>
          <div className="flex items-center gap-1 text-success text-xs font-semibold bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
            <Trophy className="w-3 h-3" />
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
