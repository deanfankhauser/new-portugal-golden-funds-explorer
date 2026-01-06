import React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface DataFreshnessBadgeProps {
  date?: string;
  variant?: 'inline' | 'page-level';
  className?: string;
}

const DataFreshnessBadge: React.FC<DataFreshnessBadgeProps> = ({ 
  date,
  variant = 'inline',
  className = ''
}) => {
  // Default to current month/year if no date provided
  const displayDate = date 
    ? format(new Date(date), 'MMMM yyyy')
    : format(new Date(), 'MMMM yyyy');

  if (variant === 'page-level') {
    return (
      <div className={`inline-flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-4 py-2 ${className}`}>
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Data last verified:{' '}
          <span className="font-medium text-foreground">{displayDate}</span>
        </span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}>
      <Clock className="h-3 w-3" />
      <span>
        Updated{' '}
        <span className="font-medium text-foreground">{displayDate}</span>
      </span>
    </span>
  );
};

export default DataFreshnessBadge;
