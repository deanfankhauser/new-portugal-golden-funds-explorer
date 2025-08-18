
import React from 'react';
import { Folder } from 'lucide-react';

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
        Explore {categoryName} Golden Visa Investment Funds and Compare
      </p>
    </div>
  );
};

export default CategoryPageHeader;
