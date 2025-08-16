
import React from 'react';
import { Fund } from '../../data/funds';
import { formatCurrency } from '../fund-details/utils/formatters';
import ComparisonTableHeader from './table/ComparisonTableHeader';
import StandardRow from './table/StandardRow';
import GeographicAllocationCell from './table/GeographicAllocationCell';
import TagsCell from './table/TagsCell';
import RedemptionTermsRow from './table/RedemptionTermsRow';
import DataFreshnessIndicator from '../common/DataFreshnessIndicator';

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
        <ComparisonTableHeader funds={funds} />
        <tbody>
          {/* Category */}
          <StandardRow 
            funds={funds}
            field="category"
            label="Fund Type"
            allSame={allSame}
          />
          
          {/* Fund Manager */}
          <StandardRow 
            funds={funds}
            field="managerName"
            label="Fund Manager"
            allSame={allSame}
          />
          
          {/* Minimum Investment */}
          <StandardRow 
            funds={funds}
            field="minimumInvestment"
            label="Minimum Investment"
            formatter={formatCurrency}
            allSame={allSame}
          />
          
          {/* Fund Size */}
          <StandardRow 
            funds={funds}
            field={(fund) => `${fund.fundSize}M EUR`}
            label="Fund Size"
            allSame={allSame}
          />
          
          {/* Target Return */}
          <StandardRow 
            funds={funds}
            field="returnTarget"
            label="Target Return"
            allSame={allSame}
          />
          
          {/* Term */}
          <StandardRow 
            funds={funds}
            field={(fund) => fund.term === 0 ? "Perpetual (open-ended)" : `${fund.term} years`}
            label="Term"
            allSame={allSame}
          />
          
          {/* Management Fee */}
          <StandardRow 
            funds={funds}
            field={(fund) => `${fund.managementFee}%`}
            label="Management Fee"
            allSame={allSame}
          />
          
          {/* Performance Fee */}
          <StandardRow 
            funds={funds}
            field={(fund) => `${fund.performanceFee}%`}
            label="Performance Fee"
            allSame={allSame}
          />
          
          {/* Subscription Fee */}
          <StandardRow 
            funds={funds}
            field={(fund) => fund.subscriptionFee ? `${fund.subscriptionFee}%` : "N/A"}
            label="Subscription Fee"
            allSame={allSame}
          />
          
          {/* Redemption Fee */}
          <StandardRow 
            funds={funds}
            field={(fund) => fund.redemptionFee ? `${fund.redemptionFee}%` : "N/A"}
            label="Redemption Fee"
            allSame={allSame}
          />
          
          {/* Geographic Allocation */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Geographic Allocation</td>
            {funds.map(fund => (
              <GeographicAllocationCell 
                key={fund.id} 
                allocations={fund.geographicAllocation} 
              />
            ))}
          </tr>
          
          {/* Redemption Terms */}
          <RedemptionTermsRow 
            funds={funds}
            field="frequency"
            label="Redemption Frequency"
            allSame={allSame}
          />
          
          {/* Notice Period */}
          <RedemptionTermsRow 
            funds={funds}
            field="noticePeriod"
            label="Notice Period"
            allSame={allSame}
          />
          
          {/* Minimum Holding Period */}
          <RedemptionTermsRow 
            funds={funds}
            field="minimumHoldingPeriod"
            label="Minimum Holding Period"
            allSame={allSame}
          />
          
          {/* Established */}
          <StandardRow 
            funds={funds}
            field="established"
            label="Established"
            allSame={allSame}
          />
          
          {/* Tags */}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Tags</td>
            {funds.map(fund => (
              <TagsCell key={fund.id} tags={fund.tags} />
            ))}
          </tr>

          {/* Data Freshness */}
          <tr className="border-b bg-blue-50/50">
            <td className="py-3 px-4 font-medium text-blue-900">Data Last Verified</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-3 px-4">
                <DataFreshnessIndicator fund={fund} variant="full" className="justify-start" />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
