import React, { useState } from 'react';
import { Fund } from '@/data/types/funds';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CompareRow from './CompareRow';
import { formatManagementFee, formatPerformanceFee, formatSubscriptionFee, formatRedemptionFee } from '@/utils/feeFormatters';

interface ComparisonTableProps {
  funds: Fund[];
  highlightDifferences?: boolean;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ funds }) => {
  const [expandedSections, setExpandedSections] = useState<{
    keyFinancials: boolean;
    feesTerms: boolean;
    riskProfile: boolean;
  }>({
    keyFinancials: true,
    feesTerms: true,
    riskProfile: true,
  });

  const fund1 = funds[0];
  const fund2 = funds[1];

  const formatCurrency = (value: number | null | undefined): string => {
    if (!value) return 'Not disclosed';
    return `€${value.toLocaleString()}`;
  };

  const formatTargetReturn = (fund: Fund): string => {
    if (fund.expectedReturnMin && fund.expectedReturnMax) {
      return `${fund.expectedReturnMin}–${fund.expectedReturnMax}% p.a.`;
    }
    if (fund.expectedReturnMin) {
      return `${fund.expectedReturnMin}% p.a.`;
    }
    return 'Not disclosed';
  };

  const formatRedemption = (fund: Fund): string => {
    if (!fund.redemptionTerms || (Array.isArray(fund.redemptionTerms) && fund.redemptionTerms.length === 0)) {
      return 'Not specified';
    }
    if (Array.isArray(fund.redemptionTerms)) {
      return fund.redemptionTerms.map(term => term.description || term.frequency || 'Available').join(', ');
    }
    return fund.redemptionTerms.frequency || 'Available';
  };

  const SectionHeader = ({ title, sectionKey }: { title: string; sectionKey: keyof typeof expandedSections }) => {
    const isExpanded = expandedSections[sectionKey];
    const Icon = isExpanded ? ChevronUp : ChevronDown;

    return (
      <div 
        className="py-5 px-7 bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
        onClick={() => setExpandedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }))}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    );
  };

  // Determine winners for each metric
  const minInvestmentWinner = (fund1.minimumInvestment || Infinity) < (fund2.minimumInvestment || Infinity) ? 'fund1' : 
                               (fund2.minimumInvestment || Infinity) < (fund1.minimumInvestment || Infinity) ? 'fund2' : null;
  
  const targetReturnWinner = (fund1.expectedReturnMax || 0) > (fund2.expectedReturnMax || 0) ? 'fund1' :
                             (fund2.expectedReturnMax || 0) > (fund1.expectedReturnMax || 0) ? 'fund2' : null;
  
  const mgmtFeeWinner = (fund1.managementFee || Infinity) < (fund2.managementFee || Infinity) ? 'fund1' :
                        (fund2.managementFee || Infinity) < (fund1.managementFee || Infinity) ? 'fund2' : null;
  
  const redemptionWinner = (fund1.redemptionTerms && (!fund2.redemptionTerms || (Array.isArray(fund2.redemptionTerms) && fund2.redemptionTerms.length === 0))) ? 'fund1' :
                           (fund2.redemptionTerms && (!fund1.redemptionTerms || (Array.isArray(fund1.redemptionTerms) && fund1.redemptionTerms.length === 0))) ? 'fund2' : null;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden mb-8">
      <SectionHeader title="Key Financials" sectionKey="keyFinancials" />
      {expandedSections.keyFinancials && (
        <div className="px-7 py-2">
          <CompareRow 
            label="Min. Investment" 
            valueA={formatCurrency(fund1.minimumInvestment)}
            valueB={formatCurrency(fund2.minimumInvestment)}
            winnerA={minInvestmentWinner === 'fund1'}
            winnerB={minInvestmentWinner === 'fund2'}
          />
          <CompareRow 
            label="Target Return" 
            valueA={formatTargetReturn(fund1)}
            valueB={formatTargetReturn(fund2)}
            winnerA={targetReturnWinner === 'fund1'}
            winnerB={targetReturnWinner === 'fund2'}
          />
          <CompareRow 
            label="Fund Size" 
            valueA={formatCurrency(fund1.fundSize)}
            valueB={formatCurrency(fund2.fundSize)}
          />
          <CompareRow 
            label="Established" 
            valueA={fund1.established ? fund1.established.toString() : 'N/A'}
            valueB={fund2.established ? fund2.established.toString() : 'N/A'}
          />
        </div>
      )}

      <SectionHeader title="Fees & Costs" sectionKey="feesTerms" />
      {expandedSections.feesTerms && (
        <div className="px-7 py-2">
          <CompareRow 
            label="Management Fee" 
            valueA={formatManagementFee(fund1.managementFee)}
            valueB={formatManagementFee(fund2.managementFee)}
            winnerA={mgmtFeeWinner === 'fund1'}
            winnerB={mgmtFeeWinner === 'fund2'}
          />
          <CompareRow 
            label="Performance Fee" 
            valueA={formatPerformanceFee(fund1.performanceFee)}
            valueB={formatPerformanceFee(fund2.performanceFee)}
          />
          <CompareRow 
            label="Subscription Fee" 
            valueA={formatSubscriptionFee(fund1.subscriptionFee)}
            valueB={formatSubscriptionFee(fund2.subscriptionFee)}
          />
          <CompareRow 
            label="Redemption Fee" 
            valueA={formatRedemptionFee(fund1.redemptionFee)}
            valueB={formatRedemptionFee(fund2.redemptionFee)}
          />
          <CompareRow 
            label="Hurdle Rate" 
            valueA={fund1.hurdleRate ? `${fund1.hurdleRate}%` : 'N/A'}
            valueB={fund2.hurdleRate ? `${fund2.hurdleRate}%` : 'N/A'}
          />
        </div>
      )}

      <SectionHeader title="Liquidity & Terms" sectionKey="riskProfile" />
      {expandedSections.riskProfile && (
        <div className="px-7 py-2">
          <CompareRow 
            label="Redemption" 
            valueA={formatRedemption(fund1)}
            valueB={formatRedemption(fund2)}
            winnerA={redemptionWinner === 'fund1'}
            winnerB={redemptionWinner === 'fund2'}
            muted={!fund1.redemptionTerms && !fund2.redemptionTerms}
          />
          <CompareRow 
            label="Lock-up Period" 
            valueA={fund1.redemptionTerms?.minimumHoldingPeriod ? `${fund1.redemptionTerms.minimumHoldingPeriod} months` : 'None'}
            valueB={fund2.redemptionTerms?.minimumHoldingPeriod ? `${fund2.redemptionTerms.minimumHoldingPeriod} months` : 'None'}
          />
          <CompareRow 
            label="Risk Band" 
            valueA={fund1.riskBand || 'Not disclosed'}
            valueB={fund2.riskBand || 'Not disclosed'}
          />
          <CompareRow 
            label="Category" 
            valueA={fund1.category || 'Not disclosed'}
            valueB={fund2.category || 'Not disclosed'}
          />
        </div>
      )}
    </div>
  );
};

export default ComparisonTable;
