
import React from 'react';
import { Tag as TagIcon } from 'lucide-react';

interface TagPageHeaderProps {
  tagName: string;
}

const TagPageHeader = ({ tagName }: TagPageHeaderProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className="flex items-center justify-center mb-4">
        <TagIcon className="w-6 h-6 text-[#EF4444] mr-2" />
        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">Tag</span>
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center" itemProp="name">
        {tagName} Golden Visa Investment Funds
      </h1>
      
      <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center" itemProp="description">
        Explore {tagName} Golden Visa Investment Funds and Compare
      </p>
    </div>
  );
};

export default TagPageHeader;
