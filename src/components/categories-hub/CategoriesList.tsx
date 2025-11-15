
import React from 'react';
import { Link } from 'react-router-dom';
import { Folder, AlertTriangle } from 'lucide-react';
import { categoryToSlug } from '@/lib/utils';
import { isCategoryGVEligible } from '../../data/services/gv-eligibility-service';

interface CategoriesListProps {
  categories: string[];
}

const CategoriesList: React.FC<CategoriesListProps> = ({ categories }) => {
  return (
    <section className="bg-card p-8 rounded-xl border border-border shadow-sm" aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Portugal Golden Visa Investment Fund Categories ({categories.length})
      </h2>
      
      <ul className="grid grid-cols-1 gap-4" itemProp="itemListElement" itemScope itemType="https://schema.org/ItemList">
        {categories.map((category, index) => {
          const isGVEligible = isCategoryGVEligible(category as any);
          return (
            <li key={category} 
              className="group border border-border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              itemProp="item" 
              itemScope 
              itemType="https://schema.org/Thing"
            >
              <Link 
                to={`/categories/${categoryToSlug(category)}`} 
                className="p-6 flex items-center justify-between hover:bg-muted/50"
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Folder className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <meta itemProp="position" content={`${index + 1}`} />
                    <span itemProp="name" className="font-semibold text-lg text-foreground block truncate">
                      {category}
                    </span>
                  </div>
                </div>
                <span className="text-primary ml-2 flex-shrink-0 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </li>
          );
        })}
      </ul>
      
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-muted-foreground mb-4">
          Each category represents a different investment approach in the Portuguese market. Click on a category to see all funds in that investment area.
        </p>
        <Link 
          to="/" 
          className="text-primary hover:underline flex items-center font-medium"
        >
          View all funds
        </Link>
      </div>
    </section>
  );
};

export default CategoriesList;
