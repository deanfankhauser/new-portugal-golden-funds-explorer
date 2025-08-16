
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
    <tr className="border-b bg-amber-50/30">
      <td className="py-3 px-4 font-medium text-gray-600 relative">
        {label}
        <span className="ml-2 text-xs text-amber-600 font-medium">CLIENT ONLY</span>
      </td>
      {funds.map(fund => (
        <td key={fund.id} className="py-3 px-4 text-amber-600 font-medium">{placeholder}</td>
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

      {/* Client Access CTA - Only show if content is gated */}
      {ContentGatingService.shouldGateMetric('managementFee', isAuthenticated) && (
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-xl border-2 border-amber-200">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Lock className="w-6 h-6 text-amber-600" />
              <span className="text-sm font-bold text-amber-800 uppercase tracking-wide">For Movingto Clients Only</span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Access Detailed Fund Analysis & Due Diligence
            </h3>
            
            <p className="text-gray-700 mb-4 max-w-2xl mx-auto leading-relaxed">
              Our clients receive comprehensive fund analysis including detailed fee breakdowns, geographic allocations, 
              redemption terms, and verified due diligence data to make informed Golden Visa investment decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button 
                onClick={handleUnlockClick}
                className="bg-[#EF4444] hover:bg-[#EF4444]/90 px-6 py-3 text-white font-semibold"
              >
                <Eye className="w-5 h-5 mr-2" />
                Existing Client Login
              </Button>
              
              <div className="text-sm text-gray-500 sm:mx-3">or</div>
              
              <a 
                href="https://cal.com/movingto/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#EF4444] border-2 border-[#EF4444] px-6 py-3 rounded-md font-semibold transition-colors"
              >
                📞 Book Free Consultation
              </a>
            </div>
            
            <p className="text-xs text-gray-500 mt-3">
              Free 30-minute consultation • No obligation • Speak with Portugal investment specialist
            </p>
          </div>
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
