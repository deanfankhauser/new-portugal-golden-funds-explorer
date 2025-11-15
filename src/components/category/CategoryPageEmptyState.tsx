
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CategoryPageEmptyStateProps {
  categoryName: string;
}

const CategoryPageEmptyState: React.FC<CategoryPageEmptyStateProps> = ({ categoryName }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-card rounded-xl border border-border p-12 text-center">
      <h3 className="text-2xl font-semibold mb-3">No funds found</h3>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
        No funds are currently in the {categoryName} category
      </p>
      <Button
        onClick={() => navigate('/')}
        size="lg"
      >
        Browse All Funds
      </Button>
    </div>
  );
};

export default CategoryPageEmptyState;
