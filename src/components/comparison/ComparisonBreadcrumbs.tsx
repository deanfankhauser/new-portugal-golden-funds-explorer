
import React from 'react';
import { Link } from 'react-router-dom';

const ComparisonBreadcrumbs = () => {
  return (
    <nav aria-label="breadcrumbs" className="mb-6">
      <ol className="flex items-center text-sm text-gray-500">
        <li>
          <Link to="/" className="hover:text-[#EF4444]">Home</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <Link to="/comparisons" className="hover:text-[#EF4444]">Fund Comparisons</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <span className="font-medium text-[#EF4444]">Compare Selected Funds</span>
        </li>
      </ol>
    </nav>
  );
};

export default ComparisonBreadcrumbs;
