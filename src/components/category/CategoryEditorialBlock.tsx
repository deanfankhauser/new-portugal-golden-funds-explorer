import React, { useEffect, useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { categoryToSlug } from '../../lib/utils';


interface CategoryEditorialBlockProps {
  categoryName: string;
}

const CategoryEditorialBlock: React.FC<CategoryEditorialBlockProps> = ({ categoryName }) => {
  const [editorialContent, setEditorialContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEditorialContent = async () => {
      try {
        const categorySlug = categoryToSlug(categoryName);
        
        const { data, error } = await supabase
          .from('category_editorial')
          .select('editorial_content')
          .eq('category_slug', categorySlug)
          .single();

        if (error) {
          console.log('No editorial content found for category:', categorySlug);
          setEditorialContent(null);
        } else {
          setEditorialContent(data.editorial_content);
        }
      } catch (err) {
        console.error('Error fetching editorial content:', err);
        setEditorialContent(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEditorialContent();
  }, [categoryName]);

  // Don't render anything if no content and not loading
  if (!isLoading && !editorialContent) {
    return null;
  }

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="bg-muted/30 rounded-xl border border-border p-8 mb-8 animate-pulse">
        <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-xl border border-border p-8 mb-8">
      <h2 className="text-xl font-semibold mb-3 text-foreground">
        About {categoryName} Funds
      </h2>
      <p className="text-muted-foreground leading-relaxed">
        {editorialContent}
      </p>
    </div>
  );
};

export default CategoryEditorialBlock;
