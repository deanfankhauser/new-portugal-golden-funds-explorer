
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag as TagIcon } from 'lucide-react';

const TagsHubHeader = () => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6 sm:mb-8">
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        <TagIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2" />
        <span className="text-xs sm:text-sm bg-gray-100 px-2 sm:px-3 py-1 rounded-full">Directory</span>
      </div>
      
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-center" itemProp="name">
        Portugal Golden Visa Investment Fund Tags
      </h1>
      
      <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto text-center px-2 sm:px-0" itemProp="description">
        Browse all investment types, risk levels, and focus areas. 
        Check our <Link to="/" className="text-primary hover:underline">complete fund list</Link> for detailed rankings.
      </p>
    </div>
  );
};

export default TagsHubHeader;
