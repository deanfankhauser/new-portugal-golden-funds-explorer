import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/types/funds';

interface FundComparisonBreadcrumbsProps {
  fund1: Fund;
  fund2: Fund;
}

const FundComparisonBreadcrumbs: React.FC<FundComparisonBreadcrumbsProps> = ({ fund1, fund2 }) => {
  return (
    <nav aria-label="breadcrumbs" className="mb-6">
      <ol className="flex items-center text-sm text-gray-500">
        <li>
          <Link to="/" className="hover:text-[#EF4444] transition-colors">Home</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <Link to="/comparisons" className="hover:text-[#EF4444] transition-colors">Fund Comparisons</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <span className="font-medium text-[#EF4444]">{fund1.name} vs {fund2.name}</span>
        </li>
      </ol>
    </nav>
  );
};

export default FundComparisonBreadcrumbs;