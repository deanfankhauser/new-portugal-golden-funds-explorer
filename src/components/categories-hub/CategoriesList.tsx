
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
    <section className="bg-card p-4 sm:p-6 rounded-lg shadow-sm" aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Portugal Golden Visa Investment Fund Categories ({categories.length})
      </h2>
      
      <ul className="grid grid-cols-1 gap-3 sm:gap-4" itemProp="itemListElement" itemScope itemType="https://schema.org/ItemList">
        {categories.map((category, index) => {
          const isGVEligible = isCategoryGVEligible(category as any);
          return (
            <li key={category} 
              className="border border-border rounded-lg hover:shadow-md transition-all duration-300"
              itemProp="item" 
              itemScope 
              itemType="https://schema.org/Thing"
            >
              <Link 
                to={`/categories/${categoryToSlug(category)}`} 
                className="p-3 sm:p-4 flex items-center justify-between hover:bg-muted min-h-[60px]"
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Folder className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <meta itemProp="position" content={`${index + 1}`} />
                    <span itemProp="name" className="font-medium text-base sm:text-lg text-foreground block truncate">
                      {category}
                    </span>
                  </div>
                </div>
                <span className="text-primary ml-2 flex-shrink-0">→</span>
              </Link>
            </li>
          );
        })}
      </ul>
      
      <div className="mt-6 sm:mt-8 pt-4 border-t border-border">
        <p className="text-muted-foreground mb-4 text-sm sm:text-base">
          Each category represents a different investment approach in the Portuguese market. Click on a category to see all funds in that investment area.
        </p>
        <Link 
          to="/" 
          className="text-primary hover:underline flex items-center text-sm sm:text-base"
        >
          View all funds
        </Link>
      </div>
    </section>
  );
};

export default CategoriesList;
