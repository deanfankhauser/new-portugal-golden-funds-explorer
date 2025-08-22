
import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryPageEmptyStateProps {
  categoryName: string;
}

const CategoryPageEmptyState: React.FC<CategoryPageEmptyStateProps> = ({ categoryName }) => {
  return (
    <div className="text-center py-10 bg-card rounded-lg shadow-sm">
      <h3 className="text-xl font-medium mb-2">No funds found</h3>
      <p className="text-muted-foreground">
        No funds are currently in the {categoryName} category
      </p>
      <Link to="/index" className="inline-block mt-4 text-primary hover:underline">
        Browse Portugal Golden Visa Investment Fund Index
      </Link>
    </div>
  );
};

export default CategoryPageEmptyState;
