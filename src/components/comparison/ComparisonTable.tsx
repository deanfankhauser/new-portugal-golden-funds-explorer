
import React, { useState } from 'react';
import { Fund } from '../../data/funds';
import { formatCurrency } from '../fund-details/utils/formatters';
import ComparisonTableHeader from './table/ComparisonTableHeader';
import StandardRow from './table/StandardRow';
import GeographicAllocationCell from './table/GeographicAllocationCell';
import TagsCell from './table/TagsCell';
import RedemptionTermsRow from './table/RedemptionTermsRow';
import { useAuth } from '../../contexts/AuthContext';
import { ContentGatingService } from '../../services/contentGatingService';
import PasswordDialog from '../PasswordDialog';
import { Button } from '@/components/ui/button';
import { Lock, Eye } from 'lucide-react';

interface ComparisonTableProps {
  funds: Fund[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ funds }) => {
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const handleUnlockClick = () => {
    setShowPasswordDialog(true);
  };

  // Helper to check if all values in an array are the same
  const allSame = (values: any[]) => {
    return values.every(v => v === values[0]);
  };

  // Show gated content for non-authenticated users
  if (!isAuthenticated) {
    return (
      <>
        <div className="relative">
          <div className="overflow-x-auto filter blur-sm">
            <table className="w-full border-collapse">
              <ComparisonTableHeader funds={funds} />
              <tbody>
                {/* Show limited public data */}
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
                  field="returnTarget"
                  label="Target Return"
                  allSame={allSame}
                />
                
                {/* Placeholder rows for gated content */}
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Management Fee</td>
                  {funds.map(fund => (
                    <td key={fund.id} className="py-3 px-4">•.••%</td>
                  ))}
                </tr>
                
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Performance Fee</td>
                  {funds.map(fund => (
                    <td key={fund.id} className="py-3 px-4">••.•%</td>
                  ))}
                </tr>
                
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Geographic Allocation</td>
                  {funds.map(fund => (
                    <td key={fund.id} className="py-3 px-4">••• Data</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Overlay with unlock button */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center bg-white p-6 rounded-lg shadow-lg border max-w-md">
              <Lock className="w-8 h-8 text-[#EF4444] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Advanced Fund Comparison</h3>
              <p className="text-sm text-gray-600 mb-4">
                Compare detailed fees, allocations, and performance metrics side-by-side
              </p>
              <Button 
                onClick={handleUnlockClick}
                className="bg-[#EF4444] hover:bg-[#EF4444]/90"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Full Comparison
              </Button>
            </div>
          </div>
        </div>

        <PasswordDialog 
          open={showPasswordDialog}
          onOpenChange={setShowPasswordDialog}
        />
      </>
    );
  }

  // Show full content for authenticated users
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
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
