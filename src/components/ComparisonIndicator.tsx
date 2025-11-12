
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../contexts/ComparisonContext';
import { Button } from '@/components/ui/button';
import { GitCompare } from 'lucide-react';

const ComparisonIndicator = () => {
  const navigate = useNavigate();
  const { compareFunds } = useComparison();
  const count = compareFunds.length;

  // SSR-safe: Don't render during server-side rendering
  if (typeof window === 'undefined') return null;

  if (count === 0) {
    return null;
  }

  const handleCompareClick = () => {
    navigate('/compare');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="bg-transparent text-background hover:bg-background/10 hover:!text-background relative"
      onClick={handleCompareClick}
      aria-label={`Compare funds (${count})`}
    >
      <GitCompare className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </Button>
  );
};

export default ComparisonIndicator;
