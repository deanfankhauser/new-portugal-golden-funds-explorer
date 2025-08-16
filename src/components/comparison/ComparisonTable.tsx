
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
import LazyPasswordDialog from '../common/LazyPasswordDialog';
import { Button } from '@/components/ui/button';
import { Lock, Eye } from 'lucide-react';
import DataFreshnessIndicator from '../common/DataFreshnessIndicator';

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

  // Component for gated row placeholder
  const GatedRow: React.FC<{ label: string; placeholder: string }> = ({ label, placeholder }) => (
    <tr className="border-b bg-gray-50/50">
      <td className="py-3 px-4 font-medium text-gray-600">{label}</td>
      {funds.map(fund => (
        <td key={fund.id} className="py-3 px-4 text-gray-400 italic">{placeholder}</td>
      ))}
    </tr>
  );

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
              field="returnTarget"
              label="Target Return"
              allSame={allSame}
            />

            <StandardRow 
              funds={funds}
              field="established"
              label="Established"
              allSame={allSame}
            />

            {/* Gated Content - Premium Information */}
            {ContentGatingService.shouldGateMetric('managementFee', isAuthenticated) ? (
              <>
                <GatedRow label="Fund Size" placeholder="••• Million EUR" />
                <GatedRow label="Management Fee" placeholder="•.••%" />
                <GatedRow label="Performance Fee" placeholder="••.•%" />
                {funds[0].subscriptionFee && <GatedRow label="Subscription Fee" placeholder="•.••%" />}
                {funds[0].redemptionFee && <GatedRow label="Redemption Fee" placeholder="•.••%" />}
                <GatedRow label="Geographic Allocation" placeholder="••• Data Locked" />
                <GatedRow label="Redemption Frequency" placeholder="••• Terms" />
                <GatedRow label="Notice Period" placeholder="••• Days" />
                <GatedRow label="Minimum Holding Period" placeholder="••• Months" />
              </>
            ) : (
              <>
                {/* Full details for authenticated users */}
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
              </>
            )}

            <StandardRow 
              funds={funds}
              field={(fund) => fund.term === 0 ? "Perpetual (open-ended)" : `${fund.term} years`}
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

      {/* Unlock CTA - Only show if content is gated */}
      {ContentGatingService.shouldGateMetric('managementFee', isAuthenticated) && (
        <div className="mt-6 text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
          <Lock className="w-8 h-8 text-[#EF4444] mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Unlock Advanced Fund Comparison</h3>
          <p className="text-sm text-gray-600 mb-4">
            Access detailed fee structures, geographic allocations, and redemption terms to make informed investment decisions.
          </p>
          <Button 
            onClick={handleUnlockClick}
            className="bg-[#EF4444] hover:bg-[#EF4444]/90"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Premium Details
          </Button>
        </div>
      )}

      <LazyPasswordDialog 
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </>
  );
};

export default ComparisonTable;
