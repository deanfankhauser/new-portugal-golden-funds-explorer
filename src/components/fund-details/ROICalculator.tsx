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
    
    const percentageMatch = returnString.match(/(\d+(?:\.\d+)?)-?(\d+(?:\.\d+)?)?%/);
    if (percentageMatch) {
      const minReturn = parseFloat(percentageMatch[1]);
      const maxReturn = percentageMatch[2] ? parseFloat(percentageMatch[2]) : minReturn;
      returnRate = (minReturn + maxReturn) / 2;
    } else {
      const singleMatch = returnString.match(/(\d+(?:\.\d+)?)%/);
      if (singleMatch) {
        returnRate = parseFloat(singleMatch[1]);
      }
    }
    
    setExpectedReturn(returnRate);
  }, [fund.returnTarget]);

  const calculateROI = () => {
    const annualReturn = expectedReturn / 100;
    const totalValue = investmentAmount * Math.pow(1 + annualReturn, holdingPeriod);
    const totalReturn = totalValue - investmentAmount;
    const annualizedReturn = (totalValue / investmentAmount) ** (1 / holdingPeriod) - 1;

    setResults({
      totalValue,
      totalReturn,
      annualizedReturn: annualizedReturn * 100
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
    <Card id="roi-calculator" className="border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          ROI Calculator for {fund.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="investment-amount">Investment Amount (EUR)</Label>
            <Input
              id="investment-amount"
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              min={fund.minimumInvestment}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="holding-period">Holding Period (Years)</Label>
            <Input
              id="holding-period"
              type="number"
              value={holdingPeriod}
              onChange={(e) => setHoldingPeriod(Number(e.target.value))}
              min={1}
              max={20}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
            <Input
              id="expected-return"
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              step={0.1}
              min={0}
              max={50}
            />
          </div>
        </div>
        
        <Button onClick={calculateROI} className="w-full">
          Calculate ROI
        </Button>
        
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="text-xl font-bold text-primary">{formatCurrency(results.totalValue)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total Return</div>
              <div className="text-xl font-bold text-success">{formatCurrency(results.totalReturn)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Annualized Return</div>
              <div className="text-xl font-bold text-accent">{formatPercentage(results.annualizedReturn)}</div>
            </div>
          </div>
        )}
        
        <div className="flex items-start gap-2 p-4 bg-warning/10 rounded-lg border border-warning/20">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm text-warning-foreground">
            <strong>Investment Risk Disclaimer:</strong> Past performance does not guarantee future results. 
            This calculation is for illustrative purposes only and actual returns may vary significantly. 
            Always consult with qualified financial advisors before making investment decisions.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROICalculator;