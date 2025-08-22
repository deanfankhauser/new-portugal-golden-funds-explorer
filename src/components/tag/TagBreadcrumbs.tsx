
import React from 'react';
import { Link } from 'react-router-dom';

interface TagBreadcrumbsProps {
  tagName: string;
  tagSlug: string;
}

const TagBreadcrumbs = ({ tagName, tagSlug }: TagBreadcrumbsProps) => {
  return (
    <nav aria-label="breadcrumbs" className="mb-6">
      <ol className="flex items-center text-sm text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-primary">Home</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <Link to="/tags" className="hover:text-primary">Tags</Link>
        </li>
        <li className="mx-2">/</li>
        <li>
          <span className="font-medium text-primary">{tagName}</span>
        </li>
      </ol>
    </nav>
  );
};

export default TagBreadcrumbs;
