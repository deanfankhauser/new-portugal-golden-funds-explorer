
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Folder } from 'lucide-react';
import { Fund } from '../../data/funds';

interface FundCategoryProps {
  category: Fund['category'];
}

const FundCategory: React.FC<FundCategoryProps> = ({ category }) => {
  return (
    <div className="mb-8 p-5 bg-gray-50 rounded-lg">
      <div className="flex items-center mb-4">
        <Folder className="w-5 h-5 mr-2 text-[#EF4444]" />
        <h2 className="text-2xl font-bold">Fund Category</h2>
      </div>
      <Badge className="px-3 py-1.5 text-base bg-[#EF4444] hover:bg-[#EF4444]/80">{category}</Badge>
    </div>
  );
};

export default FundCategory;
