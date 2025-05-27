
import React, { useState, useEffect } from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, AlertTriangle } from 'lucide-react';

interface ROICalculatorProps {
  fund: Fund;
}

const ROICalculator: React.FC<ROICalculatorProps> = ({ fund }) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(fund.minimumInvestment);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(5);
  const [expectedReturn, setExpectedReturn] = useState<number>(0);
  const [results, setResults] = useState<{
    totalValue: number;
    totalReturn: number;
    annualizedReturn: number;
  } | null>(null);

  // Extract numeric return from fund's returnTarget
  useEffect(() => {
    const returnString = fund.returnTarget.toLowerCase();
    let returnRate = 0;
    
    // Try to extract percentage from various formats
    const percentageMatch = returnString.match(/(\d+(?:\.\d+)?)-?(\d+(?:\.\d+)?)?%/);
    if (percentageMatch) {
      const minReturn = parseFloat(percentageMatch[1]);
      const maxReturn = percentageMatch[2] ? parseFloat(percentageMatch[2]) : minReturn;
      returnRate = (minReturn + maxReturn) / 2; // Use average if range
    } else {
      // Try to extract single percentage
      const singleMatch = returnString.match(/(\d+(?:\.\d+)?)%/);
      if (singleMatch) {
        returnRate = parseFloat(singleMatch[1]);
      }
    }
    
    setExpectedReturn(returnRate);
  }, [fund.returnTarget]);

  const calculateROI = () => {
    if (investmentAmount <= 0 || holdingPeriod <= 0 || expectedReturn < 0) {
      return;
    }

    const annualReturnRate = expectedReturn / 100;
    const totalValue = investmentAmount * Math.pow(1 + annualReturnRate, holdingPeriod);
    const totalReturn = totalValue - investmentAmount;
    const annualizedReturn = ((totalValue / investmentAmount) ** (1 / holdingPeriod) - 1) * 100;

    setResults({
      totalValue,
      totalReturn,
      annualizedReturn
    });
  };

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
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calculator className="w-5 h-5 text-[#EF4444]" />
          ROI Calculator for {fund.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="investment-amount">Investment Amount (€)</Label>
            <Input
              id="investment-amount"
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              min={fund.minimumInvestment}
              step="1000"
            />
            <p className="text-xs text-gray-500">
              Minimum: {formatCurrency(fund.minimumInvestment)}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="holding-period">Holding Period (years)</Label>
            <Input
              id="holding-period"
              type="number"
              value={holdingPeriod}
              onChange={(e) => setHoldingPeriod(Number(e.target.value))}
              min="1"
              max="30"
              step="1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
            <Input
              id="expected-return"
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              min="0"
              max="50"
              step="0.1"
            />
            <p className="text-xs text-gray-500">
              Fund target: {fund.returnTarget}
            </p>
          </div>
        </div>

        {/* Calculate Button */}
        <Button 
          onClick={calculateROI}
          className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white"
        >
          Calculate ROI
        </Button>

        {/* Results */}
        {results && (
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
        )}

        {/* Legal Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="text-amber-600 w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <h4 className="font-medium mb-2">Important Legal Disclaimer</h4>
            <p className="leading-relaxed">
              This calculator is for illustrative purposes only and does not constitute investment advice. 
              Actual returns may vary significantly and are not guaranteed. Past performance does not 
              predict future results. Investment in funds involves risk, including the possible loss of 
              principal. Please consult with qualified financial advisors before making investment decisions.
              The expected returns shown are targets only and may not be achieved.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROICalculator;
