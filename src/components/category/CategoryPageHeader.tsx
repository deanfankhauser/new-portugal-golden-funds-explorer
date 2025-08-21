
import React from 'react';
import { Folder } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryPageHeaderProps {
  categoryName: string;
}

const CategoryPageHeader: React.FC<CategoryPageHeaderProps> = ({ categoryName }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className="flex items-center justify-center mb-4">
        <Folder className="w-6 h-6 text-[#EF4444] mr-2" />
        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">Category</span>
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center" itemProp="name">
        {categoryName} Portugal Golden Visa Investment Funds
      </h1>
      
      <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center" itemProp="description">
        Explore {categoryName} Golden Visa Investment Funds and compare qualified funds. 
        Browse our <Link to="/index" className="text-primary hover:text-primary/80 underline">
          complete fund database
        </Link> or explore other <Link to="/categories" className="text-primary hover:text-primary/80 underline">
          investment categories
        </Link> to find the perfect fund for your Golden Visa application.
      </p>
    </div>
  );
};

export default CategoryPageHeader;
