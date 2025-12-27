import React from 'react';
import WinnerBadge from './WinnerBadge';

interface CompareRowProps {
  label: string;
  valueA: React.ReactNode;
  valueB: React.ReactNode;
  winnerA?: boolean;
  winnerB?: boolean;
  muted?: boolean;
  fundAName?: string;
  fundBName?: string;
}

const CompareRow: React.FC<CompareRowProps> = ({ 
  label, 
  valueA, 
  valueB, 
  winnerA = false, 
  winnerB = false,
  muted = false,
  fundAName,
  fundBName
}) => {
  return (
    <>
      {/* Desktop layout - 3 column grid */}
      <div className="hidden md:grid grid-cols-[1fr_200px_1fr] py-3.5 border-b border-border last:border-0 items-center gap-4">
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

      {/* Mobile layout - stacked cards */}
      <div className="md:hidden border-b border-border last:border-0 py-3">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2.5">
          {label}
        </div>
        <div className="space-y-2">
          {/* Fund A */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            winnerA ? 'bg-success/10 border border-success/20' : 'bg-muted/50'
          }`}>
            <div className="flex-1 min-w-0">
              {fundAName && (
                <div className="text-xs text-muted-foreground mb-0.5 truncate">{fundAName}</div>
              )}
              <span className={`text-sm font-medium break-words ${
                muted ? 'text-muted-foreground' : winnerA ? 'text-success' : 'text-foreground'
              }`}>
                {valueA}
              </span>
            </div>
            {winnerA && <WinnerBadge />}
          </div>
          {/* Fund B */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            winnerB ? 'bg-success/10 border border-success/20' : 'bg-muted/50'
          }`}>
            <div className="flex-1 min-w-0">
              {fundBName && (
                <div className="text-xs text-muted-foreground mb-0.5 truncate">{fundBName}</div>
              )}
              <span className={`text-sm font-medium break-words ${
                muted ? 'text-muted-foreground' : winnerB ? 'text-success' : 'text-foreground'
              }`}>
                {valueB}
              </span>
            </div>
            {winnerB && <WinnerBadge />}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompareRow;
