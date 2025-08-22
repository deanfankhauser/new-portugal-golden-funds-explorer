
import React from 'react';
import { Link } from 'react-router-dom';

interface FundManagerBreadcrumbsProps {
  managerName: string;
}

const FundManagerBreadcrumbs: React.FC<FundManagerBreadcrumbsProps> = ({ managerName }) => {
  return (
    <nav aria-label="breadcrumbs" className="mb-6">
      <ol className="flex items-center text-sm text-gray-500">
        <li>
          <Link to="/" className="hover:text-primary">Home</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <Link to="/managers" className="hover:text-primary">Fund Managers</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <span className="font-medium text-primary">{managerName}</span>
        </li>
      </ol>
    </nav>
  );
};

export default FundManagerBreadcrumbs;
