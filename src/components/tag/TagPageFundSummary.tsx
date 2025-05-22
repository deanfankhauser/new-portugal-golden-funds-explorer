
import React from 'react';

interface TagPageFundSummaryProps {
  count: number;
  tagName: string;
}

const TagPageFundSummary = ({ count, tagName }: TagPageFundSummaryProps) => {
  return (
    <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
      <p className="text-gray-600">
        <span itemProp="numberOfItems">{count}</span> fund{count !== 1 ? 's' : ''} tagged with <span className="font-semibold">{tagName}</span>
      </p>
      <div className="text-sm text-gray-500">
        Sorted by relevance
      </div>
    </div>
  );
};

export default TagPageFundSummary;
