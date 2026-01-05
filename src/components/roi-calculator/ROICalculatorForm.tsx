import React, { useState, useEffect } from 'react';
import { Fund } from '../../data/types/funds';
import { useRealTimeFunds } from '../../hooks/useRealTimeFunds';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getReturnTargetNumbers, getReturnTargetDisplay } from '../../utils/returnTarget';
import { calculateROIWithFees } from '../../utils/roiCalculator';

interface ROICalculatorFormProps {
  onResultsCalculated: (results: {
    grossTotalValue: number;
    grossTotalReturn: number;
    grossAnnualizedReturn: number;
    netTotalValue: number;
    netTotalReturn: number;
    netAnnualizedReturn: number;
    totalFeesPaid: number;
    managementFeesPaid: number;
    performanceFeesPaid: number;
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
  const [investmentAmount, setInvestmentAmount] = useState<number | null>(null);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(5);
  const [expectedReturn, setExpectedReturn] = useState<number>(0);
  const [showNetReturns, setShowNetReturns] = useState<boolean>(true);

  // Check if fund has incomplete data
  const hasIncompleteReturnData = selectedFund && expectedReturn === 0;
  const hasIncompleteFeeData = selectedFund && 
    (selectedFund.managementFee === 0 || selectedFund.managementFee === null || selectedFund.managementFee === undefined) && 
    (selectedFund.performanceFee === 0 || selectedFund.performanceFee === null || selectedFund.performanceFee === undefined);
  const hasMissingHurdleRate = selectedFund && 
    selectedFund.performanceFee && selectedFund.performanceFee > 0 && 
    (!selectedFund.hurdleRate || selectedFund.hurdleRate === 0);

  const hasDataWarnings = hasIncompleteReturnData || hasIncompleteFeeData || hasMissingHurdleRate;

  // Enhanced function to extract return rate using utility
  const extractReturnRate = (fund: Fund): number => {
    const { min, max } = getReturnTargetNumbers(fund);
    
    if (min != null && max != null) {
      return (min + max) / 2;
    }
    
    if (min != null) return min;
    if (max != null) return max;
    
    return 0;
  };

  // Update expected return and investment amount when selected fund changes
  useEffect(() => {
    if (selectedFund) {
      setExpectedReturn(extractReturnRate(selectedFund));
      setInvestmentAmount(selectedFund.minimumInvestment || null);
    } else {
      setInvestmentAmount(null);
      setExpectedReturn(0);
    }
  }, [selectedFund]);

  const calculateROI = () => {
    if (!investmentAmount || investmentAmount <= 0 || holdingPeriod <= 0 || expectedReturn < 0) {
      return;
    }

    const results = calculateROIWithFees(
      investmentAmount,
      holdingPeriod,
      expectedReturn,
      selectedFund
    );

    onResultsCalculated(results);
  };

  const canCalculate = investmentAmount && investmentAmount > 0 && holdingPeriod > 0 && expectedReturn > 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Fund Selection */}
      <div className="space-y-3">
        <Label htmlFor="fund-select" className="text-sm font-medium text-foreground">
          Select a fund
        </Label>
        <Select onValueChange={(value) => {
          const fund = funds.find(f => f.id === value);
          setSelectedFund(fund || null);
        }}>
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Choose a fund to calculate returns..." />
          </SelectTrigger>
          <SelectContent>
            {funds.map((fund) => (
              <SelectItem key={fund.id} value={fund.id}>
                {fund.name}{getReturnTargetDisplay(fund) ? ` · ${getReturnTargetDisplay(fund)}` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedFund && (
        <>
          {/* Data Quality Notice */}
          {hasDataWarnings && (
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium text-foreground mb-2">Incomplete data</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {hasIncompleteReturnData && (
                  <li>• No expected return target — enter a manual estimate below</li>
                )}
                {hasIncompleteFeeData && (
                  <li>• Fee data may be incomplete — actual fees may differ</li>
                )}
                {hasMissingHurdleRate && (
                  <li>• Hurdle rate not specified — performance fees calculated on all gains</li>
                )}
              </ul>
            </div>
          )}

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="investment-amount" className="text-sm font-medium text-foreground">
                Investment amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                <Input
                  id="investment-amount"
                  type="number"
                  value={investmentAmount ?? ''}
                  onChange={(e) => setInvestmentAmount(e.target.value ? Number(e.target.value) : null)}
                  min={selectedFund.minimumInvestment || 0}
                  step="1000"
                  placeholder="500,000"
                  className="pl-8 h-11"
                />
              </div>
              {selectedFund.minimumInvestment ? (
                <p className="text-xs text-muted-foreground">
                  Min: {formatCurrency(selectedFund.minimumInvestment)}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">Minimum not specified</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="holding-period" className="text-sm font-medium text-foreground">
                Holding period
              </Label>
              <div className="relative">
                <Input
                  id="holding-period"
                  type="number"
                  value={holdingPeriod}
                  onChange={(e) => setHoldingPeriod(Number(e.target.value))}
                  min="1"
                  max="30"
                  step="1"
                  className="h-11 pr-14"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">years</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expected-return" className="text-sm font-medium text-foreground">
                Expected annual return
              </Label>
              <div className="relative">
                <Input
                  id="expected-return"
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  min="0"
                  max="50"
                  step="0.1"
                  className="h-11 pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
              {getReturnTargetDisplay(selectedFund) && (
                <p className="text-xs text-muted-foreground">
                  Fund target: {getReturnTargetDisplay(selectedFund)}
                </p>
              )}
            </div>
          </div>

          {/* Net Returns Toggle */}
          <div className="flex items-center justify-between py-4 border-y border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Calculate net returns</p>
              <p className="text-sm text-muted-foreground">Deduct management and performance fees from projections</p>
            </div>
            <Switch
              id="show-net-returns"
              checked={showNetReturns}
              onCheckedChange={setShowNetReturns}
            />
          </div>

          {/* Fund Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Category</p>
              <p className="text-sm font-medium text-foreground">{selectedFund.category || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Management fee</p>
              <p className="text-sm font-medium text-foreground">
                {selectedFund.managementFee != null ? `${selectedFund.managementFee}% p.a.` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Performance fee</p>
              <p className="text-sm font-medium text-foreground">
                {selectedFund.performanceFee != null ? `${selectedFund.performanceFee}%` : 'N/A'}
              </p>
            </div>
            {selectedFund.hurdleRate != null && selectedFund.hurdleRate > 0 ? (
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Hurdle rate</p>
                <p className="text-sm font-medium text-foreground">{selectedFund.hurdleRate}%</p>
              </div>
            ) : (
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Manager</p>
                <p className="text-sm font-medium text-foreground">{selectedFund.managerName || 'N/A'}</p>
              </div>
            )}
          </div>

          {/* Calculate Button */}
          <Button 
            onClick={calculateROI}
            className="w-full h-12 text-base font-medium"
            disabled={!canCalculate}
          >
            {canCalculate ? 'Calculate projection' : 'Enter valid data to calculate'}
          </Button>

          {selectedFund.updatedAt && (
            <p className="text-xs text-muted-foreground text-center">
              Fund data last updated {new Date(selectedFund.updatedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </p>
          )}
        </>
      )}

      {/* Legal Disclaimer */}
      <div className="rounded-lg border border-border bg-muted/20 p-5">
        <p className="text-xs font-medium text-foreground mb-2">Important disclaimer</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This calculator is for illustrative purposes only and does not constitute investment advice. 
          Actual returns may vary significantly and are not guaranteed. Past performance does not 
          predict future results. Investment in funds involves risk, including the possible loss of 
          principal. The expected returns shown are targets only and may not be achieved. Fee calculations 
          are estimates based on current fund fee structures.
        </p>
      </div>
    </div>
  );
};

export default ROICalculatorForm;
