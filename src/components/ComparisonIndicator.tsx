import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../contexts/ComparisonContext';
import { GitCompare } from 'lucide-react';
import HeaderIconButton from '@/components/common/HeaderIconButton';

const ComparisonIndicator = () => {
  const navigate = useNavigate();
  const { compareFunds } = useComparison();
  const count = compareFunds.length;

  // SSR-safe: Don't render during server-side rendering
  if (typeof window === 'undefined') return null;

  const handleCompareClick = () => {
    navigate('/compare');
  };

  return (
    <HeaderIconButton
      onClick={handleCompareClick}
      ariaLabel={`Compare funds (${count})`}
      badgeCount={count}
    >
      <GitCompare className="h-5 w-5" />
    </HeaderIconButton>
  );
};

export default ComparisonIndicator;
