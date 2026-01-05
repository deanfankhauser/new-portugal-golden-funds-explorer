import React, { useState } from 'react';
import { Fund } from '@/data/types/funds';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { formatManagementFee, formatPerformanceFee, formatSubscriptionFee, formatRedemptionFee } from '@/utils/feeFormatters';
import { getReturnTargetDisplay } from '@/utils/returnTarget';
import { formatCurrencyForComparison, formatFundSize } from '@/utils/currencyFormatters';

interface MultiComparisonTableProps {
  funds: Fund[];
  highlightDifferences?: boolean;
}

interface ComparisonMetric {
  label: string;
  getValue: (fund: Fund) => string;
  getBestIndex?: (funds: Fund[]) => number | null;
}

const MultiComparisonTable: React.FC<MultiComparisonTableProps> = ({ funds, highlightDifferences }) => {
  const [expandedSections, setExpandedSections] = useState({
    keyFinancials: true,
    feesCosts: true,
    liquidityTerms: true,
  });

  if (!funds || funds.length < 2) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <p className="text-muted-foreground">Please select at least 2 funds to compare.</p>
      </div>
    );
  }

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

  const formatLockUp = (fund: Fund): string => {
    if (fund.redemptionTerms?.minimumHoldingPeriod) {
      return `${fund.redemptionTerms.minimumHoldingPeriod} months`;
    }
    return 'Not disclosed';
  };

  // Metric definitions with best-value logic
  const keyFinancialsMetrics: ComparisonMetric[] = [
    {
      label: 'Min. Investment',
      getValue: (f) => formatCurrencyForComparison(f.minimumInvestment),
      getBestIndex: (fs) => {
        const values = fs.map(f => f.minimumInvestment || Infinity);
        const min = Math.min(...values);
        if (min === Infinity || values.filter(v => v === min).length > 1) return null;
        return values.indexOf(min);
      },
    },
    {
      label: 'Target Return',
      getValue: (f) => formatTargetReturn(f),
      getBestIndex: (fs) => {
        const values = fs.map(f => f.expectedReturnMax || 0);
        const max = Math.max(...values);
        if (max === 0 || values.filter(v => v === max).length > 1) return null;
        return values.indexOf(max);
      },
    },
    {
      label: 'Fund Size (AUM)',
      getValue: (f) => formatFundSize(f.fundSize),
    },
    {
      label: 'Established',
      getValue: (f) => f.established ? String(f.established) : 'Not disclosed',
    },
    {
      label: 'Category',
      getValue: (f) => f.category || 'Not disclosed',
    },
  ];

  const feesCostsMetrics: ComparisonMetric[] = [
    {
      label: 'Management Fee',
      getValue: (f) => formatManagementFee(f.managementFee),
      getBestIndex: (fs) => {
        const values = fs.map(f => f.managementFee ?? Infinity);
        const min = Math.min(...values);
        if (min === Infinity || values.filter(v => v === min).length > 1) return null;
        return values.indexOf(min);
      },
    },
    {
      label: 'Performance Fee',
      getValue: (f) => formatPerformanceFee(f.performanceFee),
      getBestIndex: (fs) => {
        const values = fs.map(f => f.performanceFee ?? Infinity);
        const min = Math.min(...values);
        if (min === Infinity || values.filter(v => v === min).length > 1) return null;
        return values.indexOf(min);
      },
    },
    {
      label: 'Subscription Fee',
      getValue: (f) => formatSubscriptionFee(f.subscriptionFee),
    },
    {
      label: 'Redemption Fee',
      getValue: (f) => formatRedemptionFee(f.redemptionFee),
    },
    {
      label: 'Hurdle Rate',
      getValue: (f) => f.hurdleRate ? `${f.hurdleRate}%` : 'Not disclosed',
    },
  ];

  const liquidityTermsMetrics: ComparisonMetric[] = [
    {
      label: 'Redemption',
      getValue: (f) => formatRedemption(f),
    },
    {
      label: 'Lock-up Period',
      getValue: (f) => formatLockUp(f),
      getBestIndex: (fs) => {
        const values = fs.map(f => f.redemptionTerms?.minimumHoldingPeriod ?? Infinity);
        const min = Math.min(...values);
        if (min === Infinity || values.filter(v => v === min).length > 1) return null;
        return values.indexOf(min);
      },
    },
    {
      label: 'Risk Band',
      getValue: (f) => f.riskBand || 'Not disclosed',
    },
    {
      label: 'Regulator',
      getValue: (f) => f.regulatedBy || 'Not disclosed',
    },
    {
      label: 'Fund Status',
      getValue: (f) => f.fundStatus || 'Not disclosed',
    },
  ];

  const SectionHeader = ({ 
    title, 
    sectionKey, 
    isExpanded 
  }: { 
    title: string; 
    sectionKey: keyof typeof expandedSections;
    isExpanded: boolean;
  }) => {
    const Icon = isExpanded ? ChevronUp : ChevronDown;
    return (
      <tr
        className="bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        onClick={() => setExpandedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }))}
      >
        <td 
          colSpan={funds.length + 1} 
          className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground"
        >
          <div className="flex items-center justify-between">
            <span>{title}</span>
            <Icon className="w-4 h-4" />
          </div>
        </td>
      </tr>
    );
  };

  const MetricRow = ({ metric }: { metric: ComparisonMetric }) => {
    const bestIndex = metric.getBestIndex ? metric.getBestIndex(funds) : null;

    return (
      <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
        <td className="py-3 px-4 font-medium text-sm text-muted-foreground whitespace-nowrap bg-muted/20 sticky left-0">
          {metric.label}
        </td>
        {funds.map((fund, index) => {
          const value = metric.getValue(fund);
          const isBest = bestIndex === index;
          
          return (
            <td 
              key={fund.id} 
              className={`py-3 px-4 text-center text-sm font-mono ${
                isBest ? 'bg-success/10' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className={isBest ? 'font-semibold text-success' : 'text-foreground'}>
                  {value}
                </span>
                {isBest && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded bg-success text-white">
                    <Check className="w-2.5 h-2.5" />
                    Best
                  </span>
                )}
              </div>
            </td>
          );
        })}
      </tr>
    );
  };

  const renderSection = (
    title: string, 
    sectionKey: keyof typeof expandedSections, 
    metrics: ComparisonMetric[]
  ) => (
    <>
      <SectionHeader title={title} sectionKey={sectionKey} isExpanded={expandedSections[sectionKey]} />
      {expandedSections[sectionKey] && metrics.map((metric) => (
        <MetricRow key={metric.label} metric={metric} />
      ))}
    </>
  );

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b-2 border-border bg-muted/40">
              <th className="py-4 px-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground sticky left-0 bg-muted/40 min-w-[140px]">
                Metric
              </th>
              {funds.map((fund) => (
                <th key={fund.id} className="py-4 px-4 text-center min-w-[200px]">
                  <div className="font-semibold text-foreground text-sm leading-tight">
                    {fund.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {fund.managerName}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderSection('Key Financials', 'keyFinancials', keyFinancialsMetrics)}
            {renderSection('Fees & Costs', 'feesCosts', feesCostsMetrics)}
            {renderSection('Liquidity & Terms', 'liquidityTerms', liquidityTermsMetrics)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MultiComparisonTable;
