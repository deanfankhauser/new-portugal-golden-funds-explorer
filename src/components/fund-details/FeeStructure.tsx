import React from 'react';
import { Receipt, TrendingUp, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeeStructureProps {
  fund: Fund;
  formatPercentage: (value: number) => string;
}

const FeeStructure: React.FC<FeeStructureProps> = ({ fund, formatPercentage }) => {
  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Fee Structure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Management Fee
            </span>
            <span className="text-sm font-medium">{formatPercentage(fund.managementFee)}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance Fee
            </span>
            <span className="text-sm font-medium">
              {typeof fund.performanceFee === 'number' 
                ? formatPercentage(fund.performanceFee) 
                : fund.performanceFee || 'Not specified'}
            </span>
          </div>
          
          {fund.subscriptionFee !== undefined && (
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <ArrowUpCircle className="h-4 w-4" />
                Subscription Fee
              </span>
              <span className="text-sm font-medium">{formatPercentage(fund.subscriptionFee)}</span>
            </div>
          )}
          
          {fund.redemptionFee !== undefined && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <ArrowDownCircle className="h-4 w-4" />
                Redemption Fee
              </span>
              <span className="text-sm font-medium">{formatPercentage(fund.redemptionFee)}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground pt-4 border-t">
          Fees are subject to change. Please verify with the fund manager before investing.
        </p>
      </CardContent>
    </Card>
  );
};

export default FeeStructure;