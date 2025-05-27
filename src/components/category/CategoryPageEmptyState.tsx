
import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryPageEmptyStateProps {
  categoryName: string;
}

const CategoryPageEmptyState: React.FC<CategoryPageEmptyStateProps> = ({ categoryName }) => {
  return (
    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
      <h3 className="text-xl font-medium mb-2">No funds found</h3>
      <p className="text-gray-500">
        No funds are currently in the {categoryName} category
      </p>
      <Link to="/" className="inline-block mt-4 text-[#EF4444] hover:underline">
        View all funds
      </Link>
    </div>
  );
};

export default CategoryPageEmptyState;
