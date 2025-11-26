import React, { useState } from 'react';
import { Fund } from '../../data/types/funds';
import ComparisonTableHeader from './table/ComparisonTableHeader';
import StandardRow from './table/StandardRow';
import GeographicAllocationCell from './table/GeographicAllocationCell';
import RedemptionTermsRow from './table/RedemptionTermsRow';
import DataFreshnessIndicator from '../common/DataFreshnessIndicator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { calculateRiskBand, getRiskBandLabel, getRiskBandBgColor } from '@/utils/riskCalculation';
import { formatManagementFee, formatPerformanceFee, formatSubscriptionFee, formatRedemptionFee } from '@/utils/feeFormatters';
import { formatFundSize } from '@/utils/fundSizeFormatters';
import { formatCurrency } from '../fund-details/utils/formatters';
import { getReturnTargetDisplay, getReturnTargetNumbers } from '@/utils/returnTarget';
import { getFundType } from '@/utils/fundTypeUtils';
import { Link } from 'react-router-dom';

interface ComparisonTableProps {
  funds: Fund[];
  highlightDifferences?: boolean;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ funds, highlightDifferences = false }) => {
  const [keyFinancialsOpen, setKeyFinancialsOpen] = useState(true);
  const [feesTermsOpen, setFeesTermsOpen] = useState(true);
  const [riskProfileOpen, setRiskProfileOpen] = useState(true);

  const allSame = (values: any[]) => {
    if (values.length <= 1) return false;
    return values.every((val) => JSON.stringify(val) === JSON.stringify(values[0]));
  };

  const SectionHeader = ({ title, isOpen, onToggle }: { title: string; isOpen: boolean; onToggle: () => void }) => (
    <tr className="bg-muted/40 cursor-pointer hover:bg-muted/50" onClick={onToggle}>
      <td colSpan={funds.length + 1} className="py-3 px-4">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
          {title}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <ComparisonTableHeader funds={funds} />
        <tbody>
          {/* KEY FINANCIALS SECTION */}
          <SectionHeader 
            title="Key Financials" 
            isOpen={keyFinancialsOpen} 
            onToggle={() => setKeyFinancialsOpen(!keyFinancialsOpen)} 
          />
          {keyFinancialsOpen && (
            <>
              {/* Verification Status */}
              <tr className="border-b bg-muted/20">
                <td className="py-4 px-4 font-medium sticky left-0 bg-muted/20 z-10">Verification Status</td>
                {funds.map(fund => (
                  <td key={fund.id} className="py-4 px-4 text-center">
                    {fund.isVerified ? (
                      <Link to="/verification-program" className="inline-block hover:opacity-80 transition-opacity">
                        <Badge className="bg-success/10 text-success px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border border-success/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified Partner
                        </Badge>
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unverified</span>
                    )}
                  </td>
                ))}
              </tr>

              <StandardRow
                funds={funds}
                field="minimumInvestment"
                label="Minimum Investment"
                formatter={formatCurrency}
                allSame={allSame}
                bestType="lowest"
                hideIfSame={highlightDifferences}
              />

              <StandardRow
                funds={funds}
                field={(fund) => getReturnTargetDisplay(fund)}
                label="Target Return"
                allSame={allSame}
                bestType="highest"
                hideIfSame={highlightDifferences}
              />

              <StandardRow
                funds={funds}
                field={(fund) => formatFundSize(fund.fundSize)}
                label="Fund Size (AUM)"
                allSame={allSame}
                hideIfSame={highlightDifferences}
              />
            </>
          )}

          {/* FEES & TERMS SECTION */}
          <SectionHeader 
            title="Fees & Terms" 
            isOpen={feesTermsOpen} 
            onToggle={() => setFeesTermsOpen(!feesTermsOpen)} 
          />
          {feesTermsOpen && (
            <>
              {/* Combined Fees Row */}
              <tr className="border-b">
                <td className="py-4 px-4 font-medium sticky left-0 bg-card z-10">Fees</td>
                {funds.map(fund => (
                  <td key={fund.id} className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span>
                        <span className="font-semibold text-foreground">{formatManagementFee(fund.managementFee)}</span>
                        <span className="text-muted-foreground"> Mgmt</span>
                      </span>
                      <span className="text-muted-foreground/60">·</span>
                      <span>
                        <span className="font-semibold text-foreground">{formatPerformanceFee(fund.performanceFee)}</span>
                        <span className="text-muted-foreground"> Perf</span>
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {funds.some(f => f.subscriptionFee !== undefined) && (
                <StandardRow
                  funds={funds}
                  field={(fund) => formatSubscriptionFee(fund.subscriptionFee)}
                  label="Subscription Fee"
                  allSame={allSame}
                  bestType="lowest"
                  hideIfSame={highlightDifferences}
                />
              )}

              {funds.some(f => f.redemptionFee !== undefined) && (
                <StandardRow
                  funds={funds}
                  field={(fund) => formatRedemptionFee(fund.redemptionFee)}
                  label="Redemption Fee"
                  allSame={allSame}
                  bestType="lowest"
                  hideIfSame={highlightDifferences}
                />
              )}

              <StandardRow
                funds={funds}
                field={fund => {
                  if (fund.hurdleRate != null) return `${fund.hurdleRate}%`;
                  const { min } = getReturnTargetNumbers(fund);
                  if (min != null) return `${min}%`;
                  return "Not disclosed";
                }}
                label="Performance Fee Hurdle"
                allSame={allSame}
                hideIfSame={highlightDifferences}
              />

              <StandardRow
                funds={funds}
                field={(fund) => getFundType(fund) === 'Open-Ended' ? "Perpetual (open-ended)" : `${fund.term} years`}
                label="Fund Term"
                allSame={allSame}
                hideIfSame={highlightDifferences}
              />

              <StandardRow
                funds={funds}
                field={(fund) => fund.redemptionTerms?.minimumHoldingPeriod}
                label="Lock-up Period"
                formatter={(val) => val ? `${val} months` : 'Not disclosed'}
                allSame={allSame}
                bestType="lowest"
                hideIfSame={highlightDifferences}
              />

              <RedemptionTermsRow
                funds={funds}
                field="frequency"
                label="Redemption Frequency"
                allSame={allSame}
                hideIfSame={highlightDifferences}
              />

              <RedemptionTermsRow
                funds={funds}
                field="noticePeriod"
                label="Notice Period"
                allSame={allSame}
                bestType="lowest"
                hideIfSame={highlightDifferences}
              />

              <RedemptionTermsRow
                funds={funds}
                field="minimumHoldingPeriod"
                label="Minimum Holding Period"
                allSame={allSame}
                bestType="lowest"
                hideIfSame={highlightDifferences}
              />
            </>
          )}

          {/* RISK & PROFILE SECTION */}
          <SectionHeader 
            title="Risk & Profile" 
            isOpen={riskProfileOpen} 
            onToggle={() => setRiskProfileOpen(!riskProfileOpen)} 
          />
          {riskProfileOpen && (
            <>
              {/* Risk Band */}
              <tr className="border-b">
                <td className="py-4 px-4 font-medium sticky left-0 bg-card z-10">Risk Band</td>
                {funds.map(fund => {
                  const riskBand = calculateRiskBand(fund);
                  const riskLabel = getRiskBandLabel(riskBand);
                  const riskBgColor = getRiskBandBgColor(riskBand);
                  return (
                    <td key={fund.id} className="py-4 px-4 text-center">
                      <Badge className={`${riskBgColor} font-medium`}>
                        {riskLabel}
                      </Badge>
                    </td>
                  );
                })}
              </tr>

              <StandardRow
                funds={funds}
                field="category"
                label="Fund Type"
                allSame={allSame}
                hideIfSame={highlightDifferences}
              />

              <StandardRow
                funds={funds}
                field="managerName"
                label="Fund Manager"
                allSame={allSame}
                hideIfSame={highlightDifferences}
              />

              <StandardRow
                funds={funds}
                field="established"
                label="Established"
                formatter={(val) => val ? val.toString() : 'Not disclosed'}
                allSame={allSame}
                hideIfSame={highlightDifferences}
              />

              {/* Geographic Allocation */}
              <tr className="border-b">
                <td className="py-4 px-4 font-medium sticky left-0 bg-card z-10">Geographic Allocation</td>
                {funds.map(fund => (
                  <GeographicAllocationCell
                    key={fund.id}
                    allocations={fund.geographicAllocation}
                  />
                ))}
              </tr>
            </>
          )}

          {/* Data Freshness */}
          <tr className="border-b bg-muted/20">
            <td className="py-4 px-4 font-medium sticky left-0 bg-muted/20 z-10">Data Last Verified</td>
            {funds.map(fund => (
              <td key={fund.id} className="py-4 px-4">
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
