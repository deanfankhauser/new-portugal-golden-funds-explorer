
import React from 'react';
import { Link } from 'react-router-dom';

const ComparisonBreadcrumbs = () => {
  return (
    <nav aria-label="breadcrumbs" className="mb-6">
      <ol className="flex items-center text-sm text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-primary">Home</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <Link to="/comparisons" className="hover:text-primary">Fund Comparisons</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <span className="font-medium text-primary">Compare Selected Funds</span>
        </li>
      </ol>
    </nav>
  );
};

export default ComparisonBreadcrumbs;
