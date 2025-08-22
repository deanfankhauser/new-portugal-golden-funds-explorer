
import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryBreadcrumbsProps {
  categoryName: string;
}

const CategoryBreadcrumbs: React.FC<CategoryBreadcrumbsProps> = ({ categoryName }) => {
  return (
    <nav aria-label="breadcrumbs" className="mb-6">
      <ol className="flex items-center text-sm text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-primary">Home</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <Link to="/categories" className="hover:text-primary">Categories</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <span className="font-medium text-primary">{categoryName}</span>
        </li>
      </ol>
    </nav>
  );
};

export default CategoryBreadcrumbs;
