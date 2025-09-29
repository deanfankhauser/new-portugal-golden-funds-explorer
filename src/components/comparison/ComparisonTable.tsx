
import React from 'react';
import { Fund } from '../../data/funds';
import { formatCurrency } from '../fund-details/utils/formatters';
import { getFundType } from '../../utils/fundTypeUtils';
import ComparisonTableHeader from './table/ComparisonTableHeader';
import StandardRow from './table/StandardRow';
import GeographicAllocationCell from './table/GeographicAllocationCell';
import TagsCell from './table/TagsCell';
import RedemptionTermsRow from './table/RedemptionTermsRow';
import DataFreshnessIndicator from '../common/DataFreshnessIndicator';
import { getReturnTargetDisplay, getReturnTargetNumbers } from '../../utils/returnTarget';

interface ComparisonTableProps {
  funds: Fund[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ funds }) => {
  // Helper to check if all values in an array are the same
  const allSame = (values: any[]) => {
    return values.every(v => v === values[0]);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <ComparisonTableHeader funds={funds} />
          <tbody>
            {/* Always visible - Basic Information */}
            <StandardRow 
              funds={funds}
              field="category"
              label="Fund Type"
              allSame={allSame}
            />
            
            <StandardRow 
              funds={funds}
              field="managerName"
              label="Fund Manager"
              allSame={allSame}
            />
            
            <StandardRow 
              funds={funds}
              field="minimumInvestment"
              label="Minimum Investment"
              formatter={formatCurrency}
              allSame={allSame}
            />
            
            <StandardRow 
              funds={funds}
              field={(fund) => getReturnTargetDisplay(fund)}
              label="Target Annual Return"
              allSame={allSame}
            />

            <StandardRow 
              funds={funds}
              field="established"
              label="Established"
              allSame={allSame}
            />

            {/* Full financial details - now always visible */}
            
            <StandardRow 
              funds={funds}
              field={fund => {
                // Enhanced hurdle rate calculation with priority
                if (fund.hurdleRate != null) return `${fund.hurdleRate}%`;
                const { min } = getReturnTargetNumbers(fund);
                if (min != null) return `${min}%`;
                return "8%";
              }}
              label="Performance Fee Hurdle"
              allSame={allSame}
            />
            
            <StandardRow
              funds={funds}
              field={(fund) => `${fund.fundSize}M EUR`}
              label="Fund Size"
              allSame={allSame}
            />
            
            <StandardRow 
              funds={funds}
              field={(fund) => `${fund.managementFee}%`}
              label="Management Fee"
              allSame={allSame}
            />
            
            <StandardRow 
              funds={funds}
              field={(fund) => `${fund.performanceFee}%`}
              label="Performance Fee"
              allSame={allSame}
            />
            
            {(funds.some(f => f.subscriptionFee)) && (
              <StandardRow 
                funds={funds}
                field={(fund) => fund.subscriptionFee ? `${fund.subscriptionFee}%` : "N/A"}
                label="Subscription Fee"
                allSame={allSame}
              />
            )}
            
            {(funds.some(f => f.redemptionFee)) && (
              <StandardRow 
                funds={funds}
                field={(fund) => fund.redemptionFee ? `${fund.redemptionFee}%` : "N/A"}
                label="Redemption Fee"
                allSame={allSame}
              />
            )}
            
            <tr className="border-b">
              <td className="py-3 px-4 font-medium">Geographic Allocation</td>
              {funds.map(fund => (
                <GeographicAllocationCell 
                  key={fund.id} 
                  allocations={fund.geographicAllocation} 
                />
              ))}
            </tr>
            
            <RedemptionTermsRow 
              funds={funds}
              field="frequency"
              label="Redemption Frequency"
              allSame={allSame}
            />
            
            <RedemptionTermsRow 
              funds={funds}
              field="noticePeriod"
              label="Notice Period"
              allSame={allSame}
            />
            
            <RedemptionTermsRow 
              funds={funds}
              field="minimumHoldingPeriod"
              label="Minimum Holding Period"
              allSame={allSame}
            />

            <StandardRow 
              funds={funds}
              field={(fund) => getFundType(fund) === 'Open-Ended' ? "Perpetual (open-ended)" : `${fund.term} years`}
              label="Term"
              allSame={allSame}
            />

            {/* Tags - Always visible */}
            <tr className="border-b">
              <td className="py-3 px-4 font-medium">Tags</td>
              {funds.map(fund => (
                <TagsCell key={fund.id} tags={fund.tags} />
              ))}
            </tr>

            {/* Data Freshness - Always visible */}
            <tr className="border-b bg-accent/10">
              <td className="py-3 px-4 font-medium text-accent-foreground">Data Last Verified</td>
              {funds.map(fund => (
                <td key={fund.id} className="py-3 px-4">
                  <DataFreshnessIndicator fund={fund} variant="full" className="justify-start" />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

    </>
  );
};

export default ComparisonTable;
