
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ROICalculatorResultsProps {
  results: {
    grossTotalValue: number;
    grossTotalReturn: number;
    grossAnnualizedReturn: number;
    netTotalValue: number;
    netTotalReturn: number;
    netAnnualizedReturn: number;
    totalFeesPaid: number;
    managementFeesPaid: number;
    performanceFeesPaid: number;
  };
}

const ROICalculatorResults: React.FC<ROICalculatorResultsProps> = ({ results }) => {
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

  const feeImpact = results.totalFeesPaid / results.grossTotalReturn * 100;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="net" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="net" className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Net Returns (After Fees)
          </TabsTrigger>
          <TabsTrigger value="gross" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Gross Returns (Before Fees)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="net" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-success/10 rounded-lg border border-success/30">
              <h4 className="font-medium text-muted-foreground mb-1">Net Total Value</h4>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(results.netTotalValue)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/30">
              <h4 className="font-medium text-muted-foreground mb-1">Net Total Return</h4>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(results.netTotalReturn)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/30">
              <h4 className="font-medium text-muted-foreground mb-1">Net Annualized Return</h4>
              <p className="text-2xl font-bold text-accent">
                {formatPercentage(results.netAnnualizedReturn)}
              </p>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <h4 className="font-semibold text-foreground mb-3">Fee Impact Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Total Fees Paid</p>
                <p className="font-bold text-destructive">{formatCurrency(results.totalFeesPaid)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Management Fees</p>
                <p className="font-medium text-foreground">{formatCurrency(results.managementFeesPaid)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Performance Fees</p>
                <p className="font-medium text-foreground">{formatCurrency(results.performanceFeesPaid)}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Fees reduce your returns by {formatPercentage(feeImpact)} ({formatCurrency(results.totalFeesPaid)} paid over the investment period)
            </p>
          </div>
        </TabsContent>

        <TabsContent value="gross" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-success/10 rounded-lg border border-success/30">
              <h4 className="font-medium text-muted-foreground mb-1">Gross Total Value</h4>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(results.grossTotalValue)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/30">
              <h4 className="font-medium text-muted-foreground mb-1">Gross Total Return</h4>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(results.grossTotalReturn)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/30">
              <h4 className="font-medium text-muted-foreground mb-1">Gross Annualized Return</h4>
              <p className="text-2xl font-bold text-accent">
                {formatPercentage(results.grossAnnualizedReturn)}
              </p>
            </div>
          </div>

          <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Gross returns do not account for management fees ({formatCurrency(results.managementFeesPaid)}) 
              or performance fees ({formatCurrency(results.performanceFeesPaid)}). 
              Actual returns will be lower. See "Net Returns" tab for realistic projections.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ROICalculatorResults;
