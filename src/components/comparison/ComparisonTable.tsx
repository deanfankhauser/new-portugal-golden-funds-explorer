import React, { useState } from 'react';
import { Fund } from '@/data/types/funds';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CompareRow from './CompareRow';
import { formatManagementFee, formatPerformanceFee, formatSubscriptionFee, formatRedemptionFee } from '@/utils/feeFormatters';
import { getReturnTargetDisplay } from '@/utils/returnTarget';
import { formatCurrencyForComparison, formatFundSize } from '@/utils/currencyFormatters';

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

  // Guard against undefined funds
  if (!funds || funds.length < 2) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <p className="text-muted-foreground">Please select at least 2 funds to compare.</p>
      </div>
    );
  }

  const fund1 = funds[0];
  const fund2 = funds[1];

  const formatTargetReturn = (fund: Fund): string => {
    return getReturnTargetDisplay(fund) || 'Not disclosed';
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
        className="py-4 px-4 md:py-5 md:px-7 bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
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
        <div className="px-4 md:px-7 py-2">
          <CompareRow 
            label="Min. Investment" 
            valueA={formatCurrencyForComparison(fund1.minimumInvestment)}
            valueB={formatCurrencyForComparison(fund2.minimumInvestment)}
            winnerA={minInvestmentWinner === 'fund1'}
            winnerB={minInvestmentWinner === 'fund2'}
            fundAName={fund1.name}
            fundBName={fund2.name}
          />
          <CompareRow 
            label="Target Return" 
            valueA={formatTargetReturn(fund1)}
            valueB={formatTargetReturn(fund2)}
            winnerA={targetReturnWinner === 'fund1'}
            winnerB={targetReturnWinner === 'fund2'}
            fundAName={fund1.name}
            fundBName={fund2.name}
          />
          <CompareRow 
            label="Fund Size" 
            valueA={formatFundSize(fund1.fundSize)}
            valueB={formatFundSize(fund2.fundSize)}
            fundAName={fund1.name}
            fundBName={fund2.name}
          />
          <CompareRow 
            label="Established" 
            valueA={fund1.established ? String(fund1.established) : 'Not disclosed'}
            valueB={fund2.established ? String(fund2.established) : 'Not disclosed'}
            fundAName={fund1.name}
            fundBName={fund2.name}
          />
        </div>
      )}

      <SectionHeader title="Fees & Costs" sectionKey="feesTerms" />
      {expandedSections.feesTerms && (
        <div className="px-4 md:px-7 py-2">
          <CompareRow 
            label="Management Fee" 
            valueA={formatManagementFee(fund1.managementFee)}
            valueB={formatManagementFee(fund2.managementFee)}
            winnerA={mgmtFeeWinner === 'fund1'}
            winnerB={mgmtFeeWinner === 'fund2'}
            fundAName={fund1.name}
            fundBName={fund2.name}
          />
          <CompareRow 
            label="Performance Fee" 
            valueA={formatPerformanceFee(fund1.performanceFee)}
            valueB={formatPerformanceFee(fund2.performanceFee)}
            fundAName={fund1.name}
            fundBName={fund2.name}
          />
          <CompareRow 
            label="Subscription Fee" 
            valueA={formatSubscriptionFee(fund1.subscriptionFee)}
            valueB={formatSubscriptionFee(fund2.subscriptionFee)}
            fundAName={fund1.name}
            fundBName={fund2.name}
          />
          <CompareRow 
            label="Redemption Fee" 
            valueA={formatRedemptionFee(fund1.redemptionFee)}
            valueB={formatRedemptionFee(fund2.redemptionFee)}
            fundAName={fund1.name}
            fundBName={fund2.name}
          />
          <CompareRow 
            label="Hurdle Rate" 
            valueA={fund1.hurdleRate ? `${fund1.hurdleRate}%` : 'Not disclosed'}
            valueB={fund2.hurdleRate ? `${fund2.hurdleRate}%` : 'Not disclosed'}
            fundAName={fund1.name}
            fundBName={fund2.name}
          />
        </div>
      )}

      <SectionHeader title="Liquidity & Terms" sectionKey="riskProfile" />
      {expandedSections.riskProfile && (
        <div className="px-4 md:px-7 py-2">
          <CompareRow 
            label="Redemption" 
            valueA={formatRedemption(fund1)}
            valueB={formatRedemption(fund2)}
            winnerA={redemptionWinner === 'fund1'}
            winnerB={redemptionWinner === 'fund2'}
            muted={!fund1.redemptionTerms && !fund2.redemptionTerms}
            fundAName={fund1.name}
            fundBName={fund2.name}
          />
          <CompareRow 
            label="Lock-up Period" 
            valueA={fund1.redemptionTerms?.minimumHoldingPeriod ? `${fund1.redemptionTerms.minimumHoldingPeriod} months` : 'Not disclosed'}
            valueB={fund2.redemptionTerms?.minimumHoldingPeriod ? `${fund2.redemptionTerms.minimumHoldingPeriod} months` : 'Not disclosed'}
            fundAName={fund1.name}
            fundBName={fund2.name}
          />
          <CompareRow 
            label="Risk Band" 
            valueA={fund1.riskBand || 'Not disclosed'}
            valueB={fund2.riskBand || 'Not disclosed'}
            fundAName={fund1.name}
            fundBName={fund2.name}
          />
          <CompareRow 
            label="Category" 
            valueA={fund1.category || 'Not disclosed'}
            valueB={fund2.category || 'Not disclosed'}
            fundAName={fund1.name}
            fundBName={fund2.name}
          />
        </div>
      )}
    </div>
  );
};

export default ComparisonTable;
