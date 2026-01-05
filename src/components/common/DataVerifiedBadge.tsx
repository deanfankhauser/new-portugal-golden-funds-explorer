import React from 'react';
import { format } from 'date-fns';

interface DataVerifiedBadgeProps {
  lastVerifiedDate?: string;
  variant?: 'inline' | 'block';
  className?: string;
}

const DataVerifiedBadge: React.FC<DataVerifiedBadgeProps> = ({ 
  lastVerifiedDate, 
  variant = 'inline',
  className = ''
}) => {
  const displayDate = lastVerifiedDate 
    ? format(new Date(lastVerifiedDate), 'MMM d, yyyy')
    : format(new Date(), 'MMM d, yyyy');

  if (variant === 'block') {
    return (
      <div className={`bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 ${className}`}>
        <span className="text-xs text-muted-foreground">
          Data Verified as of{' '}
          <span className="font-mono text-gold-verified font-medium">{displayDate}</span>
        </span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-gold-verified" />
      <span>
        Verified{' '}
        <span className="font-mono text-foreground">{displayDate}</span>
      </span>
    </span>
  );
};

export default DataVerifiedBadge;
