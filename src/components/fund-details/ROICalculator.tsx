
import React, { useState, useEffect } from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, AlertTriangle, Lock, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LazyPasswordDialog from '../common/LazyPasswordDialog';

interface ROICalculatorProps {
  fund: Fund;
}

const ROICalculator: React.FC<ROICalculatorProps> = ({ fund }) => {
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
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

  const handleUnlockClick = () => {
    setShowPasswordDialog(true);
  };

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

  // Show gated content for non-authenticated users
  if (!isAuthenticated) {
    return (
      <>
        <Card id="roi-calculator" className="bg-card border border-border shadow-sm relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calculator className="w-5 h-5 text-primary" />
              ROI Calculator for {fund.name}
              <Lock className="w-5 h-5 text-muted-foreground ml-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            {/* Blurred preview */}
            <div className="filter blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label>Investment Amount (€)</Label>
                  <Input value="€•••,•••" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Holding Period (years)</Label>
                  <Input value="• years" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Expected Annual Return (%)</Label>
                  <Input value="•.•%" disabled />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <h4 className="font-medium text-muted-foreground mb-1">Total Value</h4>
                  <p className="text-2xl font-bold text-success">€•••,•••</p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-medium text-muted-foreground mb-1">Total Return</h4>
                  <p className="text-2xl font-bold text-primary">€•••,•••</p>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <h4 className="font-medium text-muted-foreground mb-1">Annualized Return</h4>
                  <p className="text-2xl font-bold text-accent">••.••%</p>
                </div>
              </div>
            </div>
            
            {/* Overlay with unlock button */}
            <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <Calculator className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Advanced ROI Calculator</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                  Calculate personalized return projections with detailed scenarios and risk analysis
                </p>
                <Button 
                  onClick={handleUnlockClick}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Access ROI Calculator
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <LazyPasswordDialog 
          open={showPasswordDialog}
          onOpenChange={setShowPasswordDialog}
        />
      </>
    );
  }

  // Show full content for authenticated users
  return (
    <Card id="roi-calculator" className="bg-card border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calculator className="w-5 h-5 text-primary" />
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
            <p className="text-xs text-muted-foreground">
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
            <p className="text-xs text-muted-foreground">
              Fund target: {fund.returnTarget}
            </p>
          </div>
        </div>

        {/* Calculate Button */}
        <Button 
          onClick={calculateROI}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Calculate ROI
        </Button>

        {/* Results */}
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <h4 className="font-medium text-muted-foreground mb-1">Total Value</h4>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(results.totalValue)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <h4 className="font-medium text-muted-foreground mb-1">Total Return</h4>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(results.totalReturn)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <h4 className="font-medium text-muted-foreground mb-1">Annualized Return</h4>
              <p className="text-2xl font-bold text-accent">
                {formatPercentage(results.annualizedReturn)}
              </p>
            </div>
          </div>
        )}

        {/* Legal Disclaimer */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="text-warning w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-warning-foreground">
            <h4 className="font-medium mb-2">Important Legal Disclaimer</h4>
            <p className="leading-relaxed">
              This calculator is for illustrative purposes only and does not constitute investment guidance. 
              Actual returns may vary significantly and are not guaranteed. Past performance does not 
              predict future results. Investment in funds involves risk, including the possible loss of 
              principal. Please consult with qualified financial guidance professionals before making investment decisions.
              The expected returns shown are targets only and may not be achieved.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROICalculator;
