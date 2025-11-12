import React, { useState } from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Info, Calculator } from 'lucide-react';
import { getReturnTargetNumbers } from '../../utils/returnTarget';

interface TrustPracticalityCardsProps {
  fund: Fund;
}

const TrustPracticalityCards: React.FC<TrustPracticalityCardsProps> = ({ fund }) => {
  const [investmentAmount, setInvestmentAmount] = useState(500000);
  
  // Enhanced hurdle rate calculation with priority
  const getHurdleRate = (fund: Fund): number | null => {
    // 1. Explicit hurdle rate (highest priority)
    if (fund.hurdleRate != null) return fund.hurdleRate;
    
    // 2. Derive from target return
    const { min } = getReturnTargetNumbers(fund);
    if (min != null) return min;
    
    // 3. No fallback - return null if no data
    return null;
  };

  const hurdle = getHurdleRate(fund);

  // Calculate estimated annual fees
  const calculateEstimatedFees = (amount: number) => {
    const managementFee = (amount * (fund.managementFee || 0)) / 100;
    // Performance fee cannot be calculated without actual return data
    const performanceFee = 0;
    return {
      management: managementFee,
      performance: performanceFee,
      total: managementFee + performanceFee
    };
  };

  const fees = calculateEstimatedFees(investmentAmount);


  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Fees Card */}
      <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300 h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            Fees
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Fee Structure */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-2">Fee Structure</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Management Fee:</span>
                <span className="font-medium">
                  {fund.managementFee ? `${fund.managementFee}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Performance Fee:</span>
                <span className="font-medium">
                  {fund.performanceFee ? `${fund.performanceFee}%` : 'None'}
                </span>
              </div>
              {fund.performanceFee && hurdle && (
                <div className="text-xs text-muted-foreground pl-2">
                  • {hurdle}% preferred return hurdle
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Fee Calculator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm text-foreground">Fee Calculator</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Estimated annual management fee cost</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2 block">Investment Amount (€)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="flex-1 px-3 py-2 text-sm border-2 border-border rounded-md bg-background focus:border-primary transition-colors"
                    step="10000"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Management fee:</span>
                  <span className="font-medium">€{fees.management.toLocaleString()}</span>
                </div>
                {fund.performanceFee && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Note: Performance fee of {fund.performanceFee}% applies to returns{hurdle ? ` above ${hurdle}% hurdle` : ''}. Actual cost depends on fund performance.
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrustPracticalityCards;