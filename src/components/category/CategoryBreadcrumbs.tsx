
import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryBreadcrumbsProps {
  categoryName: string;
}

const CategoryBreadcrumbs: React.FC<CategoryBreadcrumbsProps> = ({ categoryName }) => {
  return (
    <nav aria-label="breadcrumbs" className="mb-6">
      <ol className="flex items-center text-sm text-gray-500">
        <li>
          <Link to="/" className="hover:text-[#EF4444]">Home</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <span className="font-medium">Categories</span>
        </li>
        <li className="mx-2">/</li>
        <li>
          <span className="font-medium text-[#EF4444]">{categoryName}</span>
        </li>
      </ol>
    </nav>
  );
};

export default CategoryBreadcrumbs;
