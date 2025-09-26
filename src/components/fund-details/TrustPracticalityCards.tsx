import React, { useState } from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Info, Calculator, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from './utils/formatters';
import { isFundGVEligible } from '../../data/services/gv-eligibility-service';

interface TrustPracticalityCardsProps {
  fund: Fund;
}

const TrustPracticalityCards: React.FC<TrustPracticalityCardsProps> = ({ fund }) => {
  const [showFeeCalculator, setShowFeeCalculator] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(500000);
  
  const isGVEligible = isFundGVEligible(fund);

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Liquidity & Access Card */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-success" />
            Liquidity & Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Dealing Terms */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-2">Dealing Terms</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subscriptions:</span>
                <span className="font-medium">
                  {fund.redemptionTerms?.frequency || 'Monthly'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Redemptions:</span>
                <span className="font-medium">
                  {fund.redemptionTerms?.frequency || 'Monthly'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Notice Period:</span>
                <span className="font-medium">
                  {fund.redemptionTerms?.noticePeriod || '30 days'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lock-up:</span>
                <span className="font-medium">
                  {fund.term ? `${fund.term * 12} months` : 'None'}
                </span>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

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
                  • 8% preferred return hurdle
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

      {/* Eligibility Card */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            {isGVEligible ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground" />
            )}
            Eligibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Golden Visa Status */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-2">Golden Visa Eligibility</h4>
            <div className="flex items-start gap-2 mb-2">
              {isGVEligible ? (
                <Badge className="bg-success text-success-foreground">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Eligible
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  <XCircle className="w-3 h-3 mr-1" />
                  Not Eligible
                </Badge>
              )}
            </div>
            
            {isGVEligible && fund.eligibilityBasis && (
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Basis:</span>
                  <span className="font-medium text-right max-w-[150px]">
                    {fund.eligibilityBasis?.portugalAllocation ? `${fund.eligibilityBasis.portugalAllocation}% Portugal allocation` : 'CMVM registration'}
                  </span>
                </div>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-2">
              {isGVEligible 
                ? "Meets Portugal Golden Visa investment criteria. €500K minimum total investment required." 
                : "Does not meet current Golden Visa fund requirements."
              }
            </p>
          </div>

          <Separator />

          {/* Investor Types */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-2">Investor Types</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm">EU Qualified Investors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm">Non-EU High Net Worth</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span className="text-sm">US Taxable (PFIC implications)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm">IRA/Pension Plans</span>
              </div>
            </div>
          </div>


          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              <AlertCircle className="inline w-3 h-3 mr-1" />
              Always verify eligibility with fund manager and tax advisor
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrustPracticalityCards;