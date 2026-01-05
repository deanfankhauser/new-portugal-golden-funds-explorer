import React from 'react';

interface ROICalculatorResultsProps {
  results: {
    grossTotalValue: number;
    grossTotalReturn: number;
    grossAnnualizedReturn: number;
    netTotalValue: number;
    netTotalReturn: number;
    netAnnualizedReturn: number;
    totalFeesPaid: number;
    managementFeesPaid: number;
    performanceFeesPaid: number;
  };
}

const ROICalculatorResults: React.FC<ROICalculatorResultsProps> = ({ results }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(2)}%`;
  };

  const feeImpact = results.grossTotalReturn > 0 
    ? (results.totalFeesPaid / results.grossTotalReturn * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Primary Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Projected value</p>
          <p className="text-3xl font-semibold text-foreground tracking-tight">
            {formatCurrency(results.netTotalValue)}
          </p>
          <p className="text-sm text-muted-foreground">after fees</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total return</p>
          <p className="text-3xl font-semibold text-foreground tracking-tight">
            {formatCurrency(results.netTotalReturn)}
          </p>
          <p className="text-sm text-muted-foreground">net gain</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Annualized return</p>
          <p className="text-3xl font-semibold text-foreground tracking-tight">
            {formatPercentage(results.netAnnualizedReturn)}
          </p>
          <p className="text-sm text-muted-foreground">per year</p>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="border-t border-border pt-6">
        <p className="text-sm font-medium text-foreground mb-4">Fee impact</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total fees</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(results.totalFeesPaid)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Management fees</p>
            <p className="text-xl font-medium text-foreground">{formatCurrency(results.managementFeesPaid)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Performance fees</p>
            <p className="text-xl font-medium text-foreground">{formatCurrency(results.performanceFeesPaid)}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Fees reduce returns by {formatPercentage(feeImpact)} over the investment period
        </p>
      </div>

      {/* Gross Comparison */}
      <div className="border-t border-border pt-6">
        <p className="text-sm font-medium text-foreground mb-4">Before fees comparison</p>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Gross value</p>
            <p className="text-base font-medium text-muted-foreground">{formatCurrency(results.grossTotalValue)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Gross return</p>
            <p className="text-base font-medium text-muted-foreground">{formatCurrency(results.grossTotalReturn)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Gross annual</p>
            <p className="text-base font-medium text-muted-foreground">{formatPercentage(results.grossAnnualizedReturn)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculatorResults;
