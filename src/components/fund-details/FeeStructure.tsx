import React, { useState, useEffect } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Info } from 'lucide-react';
import { Fund } from '../../data/types/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatManagementFee, formatPerformanceFee } from '../../utils/feeFormatters';

interface FeeStructureProps {
  fund: Fund;
  formatPercentage: (value: number) => string;
}

const FeeStructure: React.FC<FeeStructureProps> = ({ fund, formatPercentage }) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(fund.minimumInvestment || 500000);
  const [managementFee, setManagementFee] = useState<number>(0);
  const [performanceFee, setPerformanceFee] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatInputValue = (value: string): string => {
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const calculateFees = (amount: number) => {
    const mgmtFee = amount * ((fund.managementFee || 0) / 100);
    // Only calculate performance fee if it exists in the fund data
    const perfFee = fund.performanceFee ? amount * (fund.performanceFee / 100) : 0;
    const total = mgmtFee + perfFee;

    setManagementFee(mgmtFee);
    setPerformanceFee(perfFee);
    setTotalCost(total);
  };

  useEffect(() => {
    calculateFees(investmentAmount);
  }, [investmentAmount, fund.managementFee, fund.performanceFee]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseFloat(e.target.value.replace(/,/g, '')) || 0;
    setInvestmentAmount(numericValue);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.value = formatInputValue(e.target.value);
  };

  return (
    <Card className="bg-card border border-border/40 rounded-2xl shadow-sm">
      <CardContent className="p-10">
        {/* Header */}
        <h2 className="text-[28px] font-semibold tracking-tight mb-8">Fees</h2>

        {/* Fee Structure */}
        <div className="mb-10">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">Fee Structure</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/15 rounded-xl p-5 flex justify-between items-center hover:from-primary/[0.07] hover:to-primary/[0.03] hover:border-primary/20 transition-all">
              <span className="text-[15px] text-foreground/70 font-medium">Management Fee</span>
              <span className="text-[28px] font-bold text-primary tracking-tight">
                {formatManagementFee(fund.managementFee)}
              </span>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/15 rounded-xl p-5 flex justify-between items-center hover:from-primary/[0.07] hover:to-primary/[0.03] hover:border-primary/20 transition-all">
              <span className="text-[15px] text-foreground/70 font-medium">Performance Fee</span>
              <span className="text-[28px] font-bold text-primary tracking-tight">
                {formatPerformanceFee(fund.performanceFee)}
              </span>
            </div>
          </div>

          {fund.hurdleRate && (
            <div className="flex flex-col gap-2 px-5 py-4 bg-muted/20 rounded-lg">
              <div className="flex items-start gap-2 text-[13px] text-muted-foreground leading-relaxed">
                <span className="text-primary font-bold mt-0.5">•</span>
                {fund.hurdleRate}% preferred return hurdle
              </div>
            </div>
          )}
        </div>

        {/* Additional Fees */}
        {(fund.subscriptionFee !== undefined || fund.redemptionFee !== undefined) && (
          <div className="mb-10 pb-10 border-b border-border/60">
            <div className="flex flex-col gap-3">
              {fund.subscriptionFee !== undefined && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground/70 flex items-center gap-2">
                    <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
                    Subscription Fee
                  </span>
                  <span className="text-sm font-semibold">{formatPercentage(fund.subscriptionFee)}</span>
                </div>
              )}
              {fund.redemptionFee !== undefined && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground/70 flex items-center gap-2">
                    <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
                    Redemption Fee
                  </span>
                  <span className="text-sm font-semibold">{formatPercentage(fund.redemptionFee)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fee Calculator */}
        <div className="pt-10 border-t border-border/60">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold tracking-tight">Fee Calculator</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Info className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Calculate estimated annual costs based on your investment amount</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="mb-7">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 block">
              Investment Amount (€)
            </label>
            <div className="relative">
              <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground pointer-events-none">
                €
              </span>
              <Input
                type="text"
                className="w-full pl-[38px] pr-[18px] py-4 text-lg font-semibold bg-muted/20 border-2 border-border/40 rounded-xl focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-border/60 transition-all"
                defaultValue={formatInputValue(investmentAmount.toString())}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/20 rounded-xl p-6">
            <div className="flex justify-between items-center py-3.5 border-b border-border/60">
              <span className="text-[15px] text-foreground/70 font-medium">Management fee:</span>
              <span className="text-lg font-bold text-foreground tracking-tight">{formatCurrency(managementFee)}</span>
            </div>
            {fund.performanceFee && (
              <div className="flex justify-between items-center py-3.5 border-b border-border/60">
                <span className="text-[15px] text-foreground/70 font-medium">Performance fee*:</span>
                <span className="text-lg font-bold text-foreground tracking-tight">{formatCurrency(performanceFee)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-5 mt-5 border-t-2 border-primary/25">
              <span className="text-base font-semibold text-foreground">Estimated annual cost:</span>
              <span className="text-[28px] font-bold text-primary tracking-tight">{formatCurrency(totalCost)}</span>
            </div>
            {fund.performanceFee && fund.hurdleRate && (
              <div className="mt-4 pt-4 border-t border-border/60 text-xs text-muted-foreground leading-relaxed">
                *Performance fee only applies if returns exceed {fund.hurdleRate}% hurdle
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeStructure;