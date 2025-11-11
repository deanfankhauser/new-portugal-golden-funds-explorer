import React, { useState, useEffect } from 'react';
import { Fund } from '../../data/funds';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, AlertTriangle } from 'lucide-react';
import { getReturnTargetNumbers } from '../../utils/returnTarget';

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

  // Extract numeric return using utility
  useEffect(() => {
    const { min, max } = getReturnTargetNumbers(fund);
    let returnRate = 8; // default

    if (min != null && max != null) {
      returnRate = (min + max) / 2;
      console.log('Fund ROI Calculator - Using return target average:', returnRate);
    } else if (min != null) {
      returnRate = min;
      console.log('Fund ROI Calculator - Using return target min:', returnRate);
    } else if (max != null) {
      returnRate = max;
      console.log('Fund ROI Calculator - Using return target max:', returnRate);
    } else {
      console.log('Fund ROI Calculator - No return data found, using default:', returnRate);
    }
    
    setExpectedReturn(returnRate);
  }, [fund]);

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
    <div id="roi-calculator" className="bg-card border border-border/40 rounded-2xl shadow-sm p-10">
      {/* Header */}
      <div className="mb-8 pb-8 border-b border-border/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">ROI Calculator</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Project potential returns for {fund.name} based on your investment parameters
        </p>
      </div>

      {/* Input Section */}
      <div className="mb-8 pb-8 border-b border-border/60">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
          Investment Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label htmlFor="investment-amount" className="text-sm font-medium text-foreground/70">
              Investment Amount (EUR)
            </Label>
            <Input
              id="investment-amount"
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              min={fund.minimumInvestment}
              className="px-4 py-4 text-lg font-semibold bg-muted/20 border-2 border-border/40 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="holding-period" className="text-sm font-medium text-foreground/70">
              Holding Period (Years)
            </Label>
            <Input
              id="holding-period"
              type="number"
              value={holdingPeriod}
              onChange={(e) => setHoldingPeriod(Number(e.target.value))}
              min={1}
              max={20}
              className="px-4 py-4 text-lg font-semibold bg-muted/20 border-2 border-border/40 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="expected-return" className="text-sm font-medium text-foreground/70">
              Expected Annual Return (%)
            </Label>
            <Input
              id="expected-return"
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              step={0.1}
              min={0}
              max={50}
              className="px-4 py-4 text-lg font-semibold bg-muted/20 border-2 border-border/40 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>
        
        <Button 
          onClick={calculateROI} 
          className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-6 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-base font-semibold"
        >
          Calculate Projected Returns
        </Button>
      </div>
        
      {/* Results Section */}
      {results && (
        <div className="mb-8 pb-8 border-b border-border/60">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            Projected Results
          </h3>
          <div className="bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/20 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Total Value
                </div>
                <div className="text-[28px] font-bold tracking-tight text-primary">
                  {formatCurrency(results.totalValue)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Total Return
                </div>
                <div className="text-[28px] font-bold tracking-tight text-green-600">
                  {formatCurrency(results.totalReturn)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Annualized Return
                </div>
                <div className="text-[28px] font-bold tracking-tight text-foreground">
                  {formatPercentage(results.annualizedReturn)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-6 bg-warning/10 rounded-xl border border-warning/20">
        <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
        <div className="text-sm text-foreground/80 leading-relaxed">
          <strong className="font-semibold">Investment Risk Disclaimer:</strong> Past performance does not guarantee future results. 
          This calculation is for illustrative purposes only and actual returns may vary significantly. 
          Always consult with qualified financial professionals before making investment decisions.
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;