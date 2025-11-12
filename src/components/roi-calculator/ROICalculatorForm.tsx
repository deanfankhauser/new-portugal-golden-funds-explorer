
import React, { useState, useEffect } from 'react';
import { Fund } from '../../data/types/funds';
import { useRealTimeFunds } from '../../hooks/useRealTimeFunds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, AlertTriangle, TrendingUp } from 'lucide-react';
import { getReturnTargetNumbers, getReturnTargetDisplay } from '../../utils/returnTarget';

interface ROICalculatorFormProps {
  onResultsCalculated: (results: {
    totalValue: number;
    totalReturn: number;
    annualizedReturn: number;
  }) => void;
  selectedFund: Fund | null;
  setSelectedFund: (fund: Fund | null) => void;
}

const ROICalculatorForm: React.FC<ROICalculatorFormProps> = ({
  onResultsCalculated,
  selectedFund,
  setSelectedFund
}) => {
  const { funds } = useRealTimeFunds();
  const [investmentAmount, setInvestmentAmount] = useState<number>(350000);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(5);
  const [expectedReturn, setExpectedReturn] = useState<number>(0);

  // Enhanced function to extract return rate using utility
  const extractReturnRate = (fund: Fund): number => {
    const { min, max } = getReturnTargetNumbers(fund);
    
    if (min != null && max != null) {
      const rate = (min + max) / 2;
      console.log('ROI Form - Using return target average:', rate);
      return rate;
    }
    
    if (min != null) {
      console.log('ROI Form - Using return target min:', min);
      return min;
    }
    
    if (max != null) {
      console.log('ROI Form - Using return target max:', max);
      return max;
    }
    
    console.log('ROI Form - No parseable return found for fund');
    return 0;
  };

  // Update expected return and investment amount when selected fund changes
  useEffect(() => {
    if (selectedFund) {
      setExpectedReturn(extractReturnRate(selectedFund));
      setInvestmentAmount(selectedFund.minimumInvestment);
    }
  }, [selectedFund]);

  const calculateROI = () => {
    if (investmentAmount <= 0 || holdingPeriod <= 0 || expectedReturn < 0) {
      return;
    }

    const annualReturnRate = expectedReturn / 100;
    const totalValue = investmentAmount * Math.pow(1 + annualReturnRate, holdingPeriod);
    const totalReturn = totalValue - investmentAmount;
    const annualizedReturn = ((totalValue / investmentAmount) ** (1 / holdingPeriod) - 1) * 100;

    onResultsCalculated({
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

  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Calculator className="w-6 h-6 text-primary" />
          Investment Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fund Selection */}
        <div className="space-y-2">
          <Label htmlFor="fund-select">Select Fund</Label>
          <Select onValueChange={(value) => {
            const fund = funds.find(f => f.id === value);
            setSelectedFund(fund || null);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a Golden Visa fund..." />
            </SelectTrigger>
            <SelectContent>
              {funds.map((fund) => (
                <SelectItem key={fund.id} value={fund.id}>
                  {fund.name} - {getReturnTargetDisplay(fund)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedFund && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedFund.name} | Min Investment: {formatCurrency(selectedFund.minimumInvestment)}
            </p>
          )}
        </div>

        {selectedFund && (
          <>
            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="investment-amount">Investment Amount (€)</Label>
                <Input
                  id="investment-amount"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  min={selectedFund.minimumInvestment}
                  step="1000"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum: {formatCurrency(selectedFund.minimumInvestment)}
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
                  Fund target: {getReturnTargetDisplay(selectedFund)}
                </p>
              </div>
            </div>

            {/* Calculate Button */}
            <Button 
              onClick={calculateROI}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Calculate ROI
            </Button>

            {/* Fund Information Card */}
            <Card className="bg-secondary border-border">
              <CardContent className="pt-4">
                <h3 className="font-semibold text-foreground mb-2">{selectedFund.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{selectedFund.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Fund Size:</span> €{selectedFund.fundSize}M
                  </div>
                  <div>
                    <span className="font-medium">Management Fee:</span> {selectedFund.managementFee}%
                  </div>
                  <div>
                    <span className="font-medium">Term:</span> {selectedFund.term} years
                  </div>
                  <div>
                    <span className="font-medium">Manager:</span> {selectedFund.managerName}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
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
              The expected returns shown are targets only and may not be achieved. This tool is designed 
              to help you understand potential scenarios but should not be the sole basis for investment 
              decisions related to the Portuguese Golden Visa program.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROICalculatorForm;
