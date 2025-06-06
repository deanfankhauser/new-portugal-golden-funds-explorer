
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-1">Total Value</h4>
        <p className="text-2xl font-bold text-green-600">
          {formatCurrency(results.totalValue)}
        </p>
      </div>
      
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-1">Total Return</h4>
        <p className="text-2xl font-bold text-blue-600">
          {formatCurrency(results.totalReturn)}
        </p>
      </div>
      
      <div className="text-center p-4 bg-purple-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-1">Annualized Return</h4>
        <p className="text-2xl font-bold text-purple-600">
          {formatPercentage(results.annualizedReturn)}
        </p>
      </div>
    </div>
  );
};

export default ROICalculatorResults;
