import React from 'react';
import WinnerBadge from './WinnerBadge';

interface CompareRowProps {
  label: string;
  valueA: React.ReactNode;
  valueB: React.ReactNode;
  winnerA?: boolean;
  winnerB?: boolean;
  muted?: boolean;
}

const CompareRow: React.FC<CompareRowProps> = ({ 
  label, 
  valueA, 
  valueB, 
  winnerA = false, 
  winnerB = false,
  muted = false 
}) => {
  return (
    <div className="grid grid-cols-[1fr_180px_1fr] md:grid-cols-[1fr_200px_1fr] py-3.5 border-b border-border last:border-0 items-center gap-4">
      <div className="text-right pr-6">
        <span className={`text-[15px] font-medium ${muted ? 'text-muted-foreground' : 'text-foreground'}`}>
          {valueA}
        </span>
        {winnerA && <WinnerBadge />}
      </div>
      <div className="text-center text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
      <div className="text-left pl-6">
        {winnerB && <WinnerBadge />}
        <span className={`text-[15px] font-medium ${muted ? 'text-muted-foreground' : 'text-foreground'}`}>
          {valueB}
        </span>
      </div>
    </div>
  );
};

export default CompareRow;
