
import React from 'react';
import { Link } from 'react-router-dom';
import { Folder } from 'lucide-react';
import { categoryToSlug } from '@/lib/utils';

interface CategoriesListProps {
  categories: string[];
}

const CategoriesList: React.FC<CategoriesListProps> = ({ categories }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm" aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="text-2xl font-bold mb-6">All Categories ({categories.length})</h2>
      
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4" itemProp="itemListElement" itemScope itemType="https://schema.org/ItemList">
        {categories.map((category, index) => (
          <li key={category} 
            className="border border-gray-100 rounded-lg hover:shadow-md transition-all duration-300"
            itemProp="item" 
            itemScope 
            itemType="https://schema.org/Thing"
          >
            <Link 
              to={`/categories/${categoryToSlug(category)}`} 
              className="p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center">
                <Folder className="w-5 h-5 mr-3 text-[#EF4444]" />
                <div>
                  <meta itemProp="position" content={`${index + 1}`} />
                  <span itemProp="name" className="font-medium text-lg text-gray-800">{category}</span>
                </div>
              </div>
              <span className="text-[#EF4444]">→</span>
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-gray-600 mb-4">
          Each category represents a different investment approach in the Portuguese market. Click on a category to see all funds in that investment area.
        </p>
        <Link 
          to="/" 
          className="text-[#EF4444] hover:underline flex items-center"
        >
          View all funds
        </Link>
      </div>
    </section>
  );
};

export default CategoriesList;
