
import React from 'react';
import { Folder } from 'lucide-react';

const CategoriesHubHeader = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className="flex items-center justify-center mb-4">
        <Folder className="w-6 h-6 text-[#EF4444] mr-2" />
        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">Directory</span>
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center" itemProp="name">
        All Golden Visa Fund Categories
      </h1>
      
      <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center" itemProp="description">
        Browse all investment categories for Portugal Golden Visa Funds
      </p>
    </div>
  );
};

export default CategoriesHubHeader;
