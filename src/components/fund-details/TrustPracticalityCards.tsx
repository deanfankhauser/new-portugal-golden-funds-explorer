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
  
  // Get dynamic hurdle rate
  const { min } = getReturnTargetNumbers(fund);
  const hurdle = min ?? 8;

  // Calculate estimated annual fees
  const calculateEstimatedFees = (amount: number) => {
    const managementFee = (amount * (fund.managementFee || 0)) / 100;
    const performanceFee = fund.performanceFee ? (amount * 0.15 * (fund.performanceFee || 0)) / 100 : 0; // Assuming 15% return for calculation
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
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-accent" />
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
              {fund.performanceFee && (
                <div className="text-xs text-muted-foreground pl-2">
                  • Subject to high-water mark
                  <br />
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
                    <p>Estimated annual cost calculation<br />Performance fee assumes 15% return</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Investment Amount (€)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background"
                    step="10000"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Management fee:</span>
                  <span className="font-medium">€{fees.management.toLocaleString()}</span>
                </div>
                {fund.performanceFee && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Performance fee*:</span>
                    <span className="font-medium">€{fees.performance.toLocaleString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Estimated annual cost:</span>
                  <span>€{fees.total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  *Performance fee only applies if returns exceed hurdle
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrustPracticalityCards;