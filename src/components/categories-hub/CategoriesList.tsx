
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { categoryToSlug } from '@/lib/utils';

interface CategoriesListProps {
  categories: string[];
}

const CategoriesList: React.FC<CategoriesListProps> = ({ categories }) => {
  return (
    <section className="bg-card p-6 sm:p-8 rounded-xl border border-border shadow-sm" aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="text-xl sm:text-2xl font-bold mb-6">
        Portugal Golden Visa Investment Fund Categories ({categories.length})
      </h2>
      
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" itemProp="itemListElement" itemScope itemType="https://schema.org/ItemList">
        {categories.map((category, index) => (
          <li key={category} 
            className="group"
            itemProp="item" 
            itemScope 
            itemType="https://schema.org/Thing"
          >
            <Link 
              to={`/categories/${categoryToSlug(category)}`} 
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:border-primary/30 hover:bg-muted/30 transition-all duration-200"
            >
              <div className="min-w-0 flex-1">
                <meta itemProp="position" content={`${index + 1}`} />
                <span itemProp="name" className="font-medium text-foreground block truncate">
                  {category}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CategoriesList;
