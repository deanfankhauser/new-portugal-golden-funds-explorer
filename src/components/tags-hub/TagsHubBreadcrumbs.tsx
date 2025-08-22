
import React from 'react';
import { Link } from 'react-router-dom';

const TagsHubBreadcrumbs = () => {
  return (
    <nav aria-label="breadcrumbs" className="mb-4 sm:mb-6">
      <ol className="flex items-center text-xs sm:text-sm text-gray-500">
        <li>
          <Link to="/" className="hover:text-primary">Home</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <span className="font-medium text-primary">Tags</span>
        </li>
      </ol>
    </nav>
  );
};

export default TagsHubBreadcrumbs;
