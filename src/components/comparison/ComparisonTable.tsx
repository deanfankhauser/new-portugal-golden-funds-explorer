
import React from 'react';
import { Fund } from '../../data/funds';
import { formatCurrency } from '../fund-details/utils/formatters';

interface ComparisonTableProps {
  funds: Fund[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ funds }) => {
  // Helper to check if all values in an array are the same
  const allSame = (values: any[]) => {
    return values.every(v => v === values[0]);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold bg-gray-50">Criteria</th>
            {funds.map(fund => (
              <th key={fund.id} className="text-left py-3 px-4 font-semibold bg-gray-50">
                {fund.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Category */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Fund Type</td>
            {funds.map(fund => (
              <td 
                key={fund.id} 
                className={`py-3 px-4 ${
                  funds.length > 1 && allSame(funds.map(f => f.category)) 
                    ? "bg-green-50" 
                    : ""
                }`}
              >
                {fund.category}
              </td>
            ))}
          </tr>
          
          {/* Minimum Investment */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Minimum Investment</td>
            {funds.map(fund => (
              <td 
                key={fund.id} 
                className={`py-3 px-4 ${
                  funds.length > 1 && allSame(funds.map(f => f.minimumInvestment)) 
                    ? "bg-green-50" 
                    : ""
                }`}
              >
                {formatCurrency(fund.minimumInvestment)}
              </td>
            ))}
          </tr>
          
          {/* Fund Size */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Fund Size</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                {fund.fundSize}M EUR
              </td>
            ))}
          </tr>
          
          {/* Target Return */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Target Return</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                {fund.returnTarget}
              </td>
            ))}
          </tr>
          
          {/* Term */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Term</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                {fund.term === 0 ? "Perpetual (open-ended)" : `${fund.term} years`}
              </td>
            ))}
          </tr>
          
          {/* Management Fee */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Management Fee</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                {fund.managementFee}%
              </td>
            ))}
          </tr>
          
          {/* Performance Fee */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Performance Fee</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                {fund.performanceFee}%
              </td>
            ))}
          </tr>
          
          {/* Subscription Fee */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Subscription Fee</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                {fund.subscriptionFee ? `${fund.subscriptionFee}%` : "N/A"}
              </td>
            ))}
          </tr>
          
          {/* Redemption Fee */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Redemption Fee</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                {fund.redemptionFee ? `${fund.redemptionFee}%` : "N/A"}
              </td>
            ))}
          </tr>
          
          {/* Geographic Allocation */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Geographic Allocation</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                {fund.geographicAllocation && fund.geographicAllocation.length > 0 ? (
                  <div className="space-y-1">
                    {fund.geographicAllocation.map((allocation, index) => (
                      <div key={index}>
                        {allocation.region}: {allocation.percentage}%
                      </div>
                    ))}
                  </div>
                ) : (
                  "N/A"
                )}
              </td>
            ))}
          </tr>
          
          {/* Redemption Terms */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Redemption Frequency</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                {fund.redemptionTerms?.frequency || "N/A"}
              </td>
            ))}
          </tr>
          
          {/* Notice Period */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Notice Period</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                {fund.redemptionTerms?.noticePeriod ? 
                  `${fund.redemptionTerms.noticePeriod} days` : 
                  "None"}
              </td>
            ))}
          </tr>
          
          {/* Minimum Holding Period */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Minimum Holding Period</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                {fund.redemptionTerms?.minimumHoldingPeriod ? 
                  `${fund.redemptionTerms.minimumHoldingPeriod} months` : 
                  "None"}
              </td>
            ))}
          </tr>
          
          {/* Fund Status */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Status</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                {fund.fundStatus}
              </td>
            ))}
          </tr>
          
          {/* Established */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Established</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                {fund.established}
              </td>
            ))}
          </tr>
          
          {/* Tags */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Tags</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {fund.tags.map(tag => (
                    <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
