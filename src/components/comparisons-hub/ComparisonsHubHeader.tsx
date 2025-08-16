
import React from 'react';
import { GitCompare } from 'lucide-react';

const ComparisonsHubHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <GitCompare className="h-12 w-12 text-[#EF4444]" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Portugal Golden Visa Fund Comparisons</h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Compare different Portugal Golden Visa investment funds side by side. 
        Analyze fees, returns, minimum investments, and more to make informed decisions.
      </p>
    </div>
  );
};

export default ComparisonsHubHeader;
