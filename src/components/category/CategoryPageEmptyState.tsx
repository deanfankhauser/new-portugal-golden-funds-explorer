import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { categoryToSlug } from '@/lib/utils';

interface CategoryPageEmptyStateProps {
  categoryName: string;
  allCategories?: string[];
}

const CategoryPageEmptyState: React.FC<CategoryPageEmptyStateProps> = ({ 
  categoryName,
  allCategories = []
}) => {
  const navigate = useNavigate();
  
  // Get related categories (excluding current)
  const relatedCategories = allCategories
    .filter(cat => cat !== categoryName)
    .slice(0, 6);
  
  return (
    <div className="space-y-8">
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <h1 className="text-2xl font-semibold mb-3">
          {categoryName} Portugal Golden Visa Investment Funds
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          This category is being updated with new fund listings. 
          Browse all funds or explore related categories below.
        </p>
        <Button
          onClick={() => navigate('/')}
          size="lg"
        >
          Browse All Funds
        </Button>
      </div>
      
      {relatedCategories.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Explore Other Categories</h3>
          <div className="flex flex-wrap gap-3">
            {relatedCategories.map(cat => (
              <Link 
                key={cat}
                to={`/categories/${categoryToSlug(cat)}`}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPageEmptyState;
