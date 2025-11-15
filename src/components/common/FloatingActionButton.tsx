import React, { useState } from 'react';
import { Bookmark, GitCompare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSavedFunds } from '@/hooks/useSavedFunds';
import { useComparison } from '@/contexts/ComparisonContext';
import { useNavigate } from 'react-router-dom';

export const FloatingActionButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { savedFunds } = useSavedFunds();
  const { compareFunds } = useComparison();
  const navigate = useNavigate();

  const savedCount = savedFunds.length;
  const compareCount = compareFunds.length;

  const handleSavedClick = () => {
    navigate('/saved-funds');
    setIsExpanded(false);
  };

  const handleCompareClick = () => {
    navigate('/compare');
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
      {/* Action Buttons */}
      <div
        className={cn(
          'flex flex-col gap-3 mb-3 transition-all duration-300 ease-out',
          isExpanded
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        {/* Saved Funds Button */}
        <button
          onClick={handleSavedClick}
          className="relative flex items-center justify-center h-12 w-12 rounded-full bg-card border-2 border-border shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          aria-label="View saved funds"
        >
          <Bookmark className="h-5 w-5 text-primary" />
          {savedCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 min-w-[20px] px-1 text-[11px] font-bold text-white bg-primary rounded-full">
              {savedCount}
            </span>
          )}
        </button>

        {/* Compare Button */}
        <button
          onClick={handleCompareClick}
          className="relative flex items-center justify-center h-12 w-12 rounded-full bg-card border-2 border-border shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          aria-label="View comparison"
        >
          <GitCompare className="h-5 w-5 text-primary" />
          {compareCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 min-w-[20px] px-1 text-[11px] font-bold text-white bg-primary rounded-full">
              {compareCount}
            </span>
          )}
        </button>
      </div>

      {/* Main FAB Button */}
      <button
        onClick={toggleExpanded}
        className={cn(
          'flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95',
          isExpanded && 'bg-muted-foreground'
        )}
        aria-label={isExpanded ? 'Close menu' : 'Open quick actions'}
      >
        <div
          className={cn(
            'transition-transform duration-300',
            isExpanded && 'rotate-180'
          )}
        >
          {isExpanded ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative">
              <Bookmark className="h-6 w-6" />
              {(savedCount > 0 || compareCount > 0) && (
                <span className="absolute -top-2 -right-2 h-3 w-3 bg-accent rounded-full animate-pulse" />
              )}
            </div>
          )}
        </div>
      </button>
    </div>
  );
};
