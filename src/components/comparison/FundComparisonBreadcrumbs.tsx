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
      <ol className="flex items-center text-sm text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <Link to="/comparisons" className="hover:text-primary transition-colors">Fund Comparisons</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <span className="font-medium text-primary">{fund1.name} vs {fund2.name}</span>
        </li>
      </ol>
    </nav>
  );
};

export default FundComparisonBreadcrumbs;