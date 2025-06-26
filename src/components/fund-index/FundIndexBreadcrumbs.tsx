
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, TrendingUp } from 'lucide-react';

const FundIndexBreadcrumbs: React.FC = () => {
  return (
    <nav aria-label="breadcrumbs" className="mb-6">
      <ol className="flex items-center text-sm text-gray-500 space-x-2">
        <li className="flex items-center">
          <Link to="/" className="hover:text-[#EF4444] flex items-center gap-1">
            <Home className="h-3 w-3" />
            Home
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight className="h-3 w-3 mx-1" />
          <TrendingUp className="h-3 w-3 mr-1" />
          <span className="font-medium text-[#EF4444]">Fund Index</span>
        </li>
      </ol>
    </nav>
  );
};

export default FundIndexBreadcrumbs;
