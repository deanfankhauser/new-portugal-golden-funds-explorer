
import React from 'react';
import { Link } from 'react-router-dom';

interface TagPageEmptyStateProps {
  tagName: string;
}

const TagPageEmptyState = ({ tagName }: TagPageEmptyStateProps) => {
  return (
    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
      <h3 className="text-xl font-medium mb-2">No funds found</h3>
      <p className="text-gray-500">
        No funds are currently tagged with {tagName}
      </p>
      <Link to="/index" className="inline-block mt-4 text-primary hover:underline">
        Browse Portugal Golden Visa Investment Fund Index
      </Link>
    </div>
  );
};

export default TagPageEmptyState;
