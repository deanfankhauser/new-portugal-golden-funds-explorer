
import React from 'react';
import { Fund } from '../../data/funds';

interface FundMetricsProps {
  fund: Fund;
  formatCurrency: (amount: number) => string;
}

const FundMetrics: React.FC<FundMetricsProps> = ({ fund, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700">Minimum Investment</h3>
        <p className="text-2xl font-bold text-[#EF4444]">{formatCurrency(fund.minimumInvestment)}</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700">Target Return</h3>
        <p className="text-2xl font-bold text-[#EF4444]">{fund.returnTarget}</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700">Fund Size</h3>
        <p className="text-2xl font-bold text-[#EF4444]">{fund.fundSize} Million EUR</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700">Term</h3>
        <p className="text-2xl font-bold text-[#EF4444]">{fund.term} years</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700">Established</h3>
        <p className="text-2xl font-bold text-[#EF4444]">{fund.established}</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700">Regulated By</h3>
        <p className="text-2xl font-bold text-[#EF4444]">{fund.regulatedBy}</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700">Location</h3>
        <p className="text-2xl font-bold text-[#EF4444]">{fund.location}</p>
      </div>
    </div>
  );
};

export default FundMetrics;
