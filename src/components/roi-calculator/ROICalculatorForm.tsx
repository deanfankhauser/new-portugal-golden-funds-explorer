
import React, { useState, useEffect } from 'react';
import { funds } from '../../data/funds';
import { Fund } from '../../data/types/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, AlertTriangle, TrendingUp } from 'lucide-react';

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
  const [investmentAmount, setInvestmentAmount] = useState<number>(350000);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(5);
  const [expectedReturn, setExpectedReturn] = useState<number>(0);

  // Extract numeric return from fund's returnTarget
  const extractReturnRate = (returnTarget: string): number => {
    const returnString = returnTarget.toLowerCase();
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
    
    return returnRate;
  };

  // Update expected return when fund changes
  useEffect(() => {
    if (selectedFund) {
      const returnRate = extractReturnRate(selectedFund.returnTarget);
      setExpectedReturn(returnRate);
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
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Calculator className="w-6 h-6 text-[#EF4444]" />
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
                  {fund.name} - {fund.returnTarget}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedFund && (
            <p className="text-sm text-gray-500">
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
                <p className="text-xs text-gray-500">
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
                <p className="text-xs text-gray-500">
                  Fund target: {selectedFund.returnTarget}
                </p>
              </div>
            </div>

            {/* Calculate Button */}
            <Button 
              onClick={calculateROI}
              className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Calculate ROI
            </Button>

            {/* Fund Information Card */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedFund.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedFund.description}</p>
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
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="text-amber-600 w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
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
