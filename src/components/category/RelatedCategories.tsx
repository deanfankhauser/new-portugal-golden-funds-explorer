
import React from 'react';
import { Link } from 'react-router-dom';
import { categoryToSlug } from '@/lib/utils';

interface RelatedCategoriesProps {
  allCategories: string[];
  currentCategory: string;
}

const RelatedCategories: React.FC<RelatedCategoriesProps> = ({ allCategories, currentCategory }) => {
  const otherCategories = allCategories.filter(cat => cat !== currentCategory);

  return (
    <div className="mt-8 pt-4 border-t border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Other Categories</h2>
      <div className="flex flex-wrap gap-2">
        {otherCategories.map(cat => (
          <Link 
            key={cat} 
            to={`/categories/${categoryToSlug(cat)}`}
            className="px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-sm"
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedCategories;
