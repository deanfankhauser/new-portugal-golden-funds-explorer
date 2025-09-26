import React from 'react';
import { FileText } from 'lucide-react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";

interface FeeStructureProps {
  fund: Fund;
  formatPercentage: (value: number) => string;
}

const FeeStructure: React.FC<FeeStructureProps> = ({ fund, formatPercentage }) => {
  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-5">
          <FileText className="w-5 h-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Fee Structure</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-muted p-4 rounded-lg border border-border">
            <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Management Fee</h3>
            <p className="text-2xl font-bold text-primary mt-1">{formatPercentage(fund.managementFee)}</p>
          </div>
          
          <div className="bg-muted p-4 rounded-lg border border-border">
            <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Performance Fee</h3>
            <p className="text-2xl font-bold text-primary mt-1">
              {typeof fund.performanceFee === 'number' 
                ? formatPercentage(fund.performanceFee) 
                : fund.performanceFee || 'Not specified'}
            </p>
          </div>
          
          {fund.subscriptionFee !== undefined && (
            <div className="bg-muted p-4 rounded-lg border border-border">
              <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Subscription Fee</h3>
              <p className="text-2xl font-bold text-primary mt-1">{formatPercentage(fund.subscriptionFee)}</p>
            </div>
          )}
          
          {fund.redemptionFee !== undefined && (
            <div className="bg-muted p-4 rounded-lg border border-border">
              <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Redemption Fee</h3>
              <p className="text-2xl font-bold text-primary mt-1">{formatPercentage(fund.redemptionFee)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeStructure;