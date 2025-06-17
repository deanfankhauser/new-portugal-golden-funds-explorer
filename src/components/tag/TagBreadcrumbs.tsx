
import React from 'react';
import { Link } from 'react-router-dom';

interface TagBreadcrumbsProps {
  tagName: string;
  tagSlug: string;
}

const TagBreadcrumbs = ({ tagName, tagSlug }: TagBreadcrumbsProps) => {
  return (
    <nav aria-label="breadcrumbs" className="mb-6">
      <ol className="flex items-center text-sm text-gray-500">
        <li>
          <Link to="/" className="hover:text-[#EF4444]">Home</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <Link to="/tags" className="hover:text-[#EF4444]">Tags</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <span className="font-medium text-[#EF4444]">{tagName}</span>
        </li>
      </ol>
    </nav>
  );
};

export default TagBreadcrumbs;
