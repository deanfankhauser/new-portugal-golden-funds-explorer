
import React from 'react';

interface ROICalculatorResultsProps {
  results: {
    totalValue: number;
    totalReturn: number;
    annualizedReturn: number;
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
      <div className="text-center p-4 bg-success/10 rounded-lg border border-success/30">
        <h4 className="font-medium text-muted-foreground mb-1">Total Value</h4>
        <p className="text-2xl font-bold text-success">
          {formatCurrency(results.totalValue)}
        </p>
      </div>
      
      <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/30">
        <h4 className="font-medium text-muted-foreground mb-1">Total Return</h4>
        <p className="text-2xl font-bold text-primary">
          {formatCurrency(results.totalReturn)}
        </p>
      </div>
      
      <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/30">
        <h4 className="font-medium text-muted-foreground mb-1">Annualized Return</h4>
        <p className="text-2xl font-bold text-accent">
          {formatPercentage(results.annualizedReturn)}
        </p>
      </div>
    </div>
  );
};

export default ROICalculatorResults;
