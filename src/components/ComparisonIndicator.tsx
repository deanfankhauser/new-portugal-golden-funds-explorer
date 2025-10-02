
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
      variant="secondary"
      onClick={handleCompareClick}
    >
      <GitCompare className="mr-2 h-4 w-4" />
      <span>Compare ({count})</span>
    </Button>
  );
};

export default ComparisonIndicator;
