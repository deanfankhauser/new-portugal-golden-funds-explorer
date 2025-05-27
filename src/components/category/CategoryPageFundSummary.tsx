
import React from 'react';

interface CategoryPageFundSummaryProps {
  count: number;
  categoryName: string;
}

const CategoryPageFundSummary: React.FC<CategoryPageFundSummaryProps> = ({ count, categoryName }) => {
  return (
    <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
      <p className="text-gray-600">
        <span itemProp="numberOfItems">{count}</span> fund{count !== 1 ? 's' : ''} in <span className="font-semibold">{categoryName}</span> category
      </p>
      <div className="text-sm text-gray-500">
        Sorted by relevance
      </div>
    </div>
  );
};

export default CategoryPageFundSummary;
