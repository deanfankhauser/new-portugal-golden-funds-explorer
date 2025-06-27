
import React from 'react';
import { Filter } from 'lucide-react';

const FundFilterHeader: React.FC = () => {
  return (
    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Filter className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Search & Filter</h2>
      </div>
      <p className="text-sm text-gray-600">Find your perfect investment fund</p>
    </div>
  );
};

export default FundFilterHeader;
