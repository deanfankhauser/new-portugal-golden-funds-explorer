
import React from 'react';
import { Link } from 'react-router-dom';

const CategoriesHubBreadcrumbs = () => {
  return (
    <nav aria-label="breadcrumbs" className="mb-6">
      <ol className="flex items-center text-sm text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-primary">Home</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <span className="font-medium text-primary">Categories</span>
        </li>
      </ol>
    </nav>
  );
};

export default CategoriesHubBreadcrumbs;
