
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../contexts/ComparisonContext';
import { Button } from '@/components/ui/button';
import { GitCompare } from 'lucide-react';

const ComparisonIndicator = () => {
  const navigate = useNavigate();
  const { compareFunds } = useComparison();
  const count = compareFunds.length;

  if (count === 0) {
    return null;
  }

  return (
    <Button
      variant="outline"
      className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white"
      onClick={() => navigate('/compare')}
    >
      <GitCompare className="mr-2 h-4 w-4" />
      <span>Compare ({count})</span>
    </Button>
  );
};

export default ComparisonIndicator;
