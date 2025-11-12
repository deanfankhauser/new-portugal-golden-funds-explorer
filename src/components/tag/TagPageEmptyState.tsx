
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface TagPageEmptyStateProps {
  tagName: string;
}

const TagPageEmptyState = ({ tagName }: TagPageEmptyStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border/40 p-10 text-center">
      <h3 className="text-2xl font-semibold mb-3">No funds found</h3>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
        No funds are currently tagged with {tagName}
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

export default TagPageEmptyState;
