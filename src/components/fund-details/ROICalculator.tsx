import React, { useState, useEffect } from 'react';
import { Fund } from '../../data/types/funds';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calculator, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { getSmartDefaults } from '../../utils/roiDefaults';
import { calculateROIWithFees, ROICalculationResult } from '../../utils/roiCalculator';
import { formatCurrency, formatPercentage } from './utils/formatters';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ROICalculatorProps {
  fund: Fund;
}

const ROICalculator: React.FC<ROICalculatorProps> = ({ fund }) => {
  const defaults = getSmartDefaults(fund);
  
  const [investmentAmount, setInvestmentAmount] = useState<number>(defaults.investmentAmount);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(defaults.holdingPeriod);
  const [expectedReturn, setExpectedReturn] = useState<number>(defaults.expectedReturn);
  const [showNetReturns, setShowNetReturns] = useState<boolean>(true);
  const [results, setResults] = useState<ROICalculationResult | null>(null);

  // Initialize with smart defaults
  useEffect(() => {
    setInvestmentAmount(defaults.investmentAmount);
    setHoldingPeriod(defaults.holdingPeriod);
    setExpectedReturn(defaults.expectedReturn);
  }, [fund, defaults.investmentAmount, defaults.holdingPeriod, defaults.expectedReturn]);

  // Generate year-by-year growth data for chart
  const generateChartData = () => {
    if (!results) return [];
    
    const chartData = [];
    let grossValue = investmentAmount;
    let netValue = investmentAmount;
    
    // Year 0
    chartData.push({
      year: 0,
      grossValue: investmentAmount,
      netValue: investmentAmount
    });
    
    // Calculate year by year
    for (let year = 1; year <= holdingPeriod; year++) {
      // Gross growth (simple compound growth)
      grossValue = grossValue * (1 + expectedReturn / 100);
      
      // Net growth (with fees)
      const yearlyGrossGrowth = netValue * (expectedReturn / 100);
      const managementFee = netValue * ((fund.managementFee || 0) / 100);
      
      // Calculate performance fee on gains above hurdle rate
      let performanceFee = 0;
      const hurdleRate = fund.hurdleRate || 0;
      const gainAboveHurdle = Math.max(0, yearlyGrossGrowth - (netValue * hurdleRate / 100));
      performanceFee = gainAboveHurdle * ((fund.performanceFee || 0) / 100);
      
      netValue = netValue + yearlyGrossGrowth - managementFee - performanceFee;
      
      chartData.push({
        year,
        grossValue: Math.round(grossValue),
        netValue: Math.round(netValue)
      });
    }
    
    return chartData;
  };

  const calculateROI = () => {
    if (investmentAmount <= 0 || holdingPeriod <= 0 || expectedReturn < 0) {
      return;
    }

    const calculatedResults = calculateROIWithFees(
      investmentAmount,
      holdingPeriod,
      expectedReturn,
      fund
    );

    setResults(calculatedResults);
  };

  const chartData = generateChartData();

  return (
    <div id="roi-calculator" className="bg-card border border-border/30 rounded-xl shadow-sm overflow-hidden">
      {/* Info Banner - when fund data is missing */}
      {!defaults.hasFundReturnData && (
        <div className="bg-primary-50/50 border-b border-primary-100/50 px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Info className="h-4 w-4 text-primary-600" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-primary-900">
                Using Industry Assumptions
              </p>
              <p className="text-sm text-primary-700">
                This fund hasn't specified target returns. You can adjust the assumptions below to project potential outcomes. 
                <a href="#contact" className="underline hover:no-underline ml-1 font-medium">
                  Contact the fund
                </a> for precise targets.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Calculator Content */}
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-primary/5 rounded-lg flex items-center justify-center">
              <Calculator className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground tracking-tight">
              Investment Calculator
            </h3>
          </div>
          <p className="text-sm text-muted-foreground ml-12">
            Project potential returns based on your investment parameters
          </p>
        </div>

        {/* Net Returns Toggle */}
        <div className="mb-8 pb-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="net-returns-toggle" className="text-sm font-medium text-foreground cursor-pointer">
                Show Net Returns
              </label>
              <p className="text-xs text-muted-foreground">
                Display returns after management and performance fees
              </p>
            </div>
            <Switch
              id="net-returns-toggle"
              checked={showNetReturns}
              onCheckedChange={setShowNetReturns}
            />
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-6 mb-8">
          {/* Investment Amount */}
          <div className="space-y-2">
            <Label htmlFor="investment-amount" className="text-sm font-medium text-foreground">
              Investment Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                €
              </span>
              <Input
                id="investment-amount"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="pl-7 h-11 border-input/60 focus:border-primary/40 focus:ring-primary/20 transition-colors"
                min={0}
                step={1000}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {defaults.investmentAmountSource}
            </p>
          </div>

          {/* Holding Period */}
          <div className="space-y-2">
            <Label htmlFor="holding-period" className="text-sm font-medium text-foreground">
              Holding Period (Years)
            </Label>
            <Input
              id="holding-period"
              type="number"
              value={holdingPeriod}
              onChange={(e) => setHoldingPeriod(Number(e.target.value))}
              className="h-11 border-input/60 focus:border-primary/40 focus:ring-primary/20 transition-colors"
              min={1}
              max={30}
            />
            <p className="text-xs text-muted-foreground">
              {defaults.holdingPeriodSource}
            </p>
          </div>

          {/* Expected Annual Return */}
          <div className="space-y-2">
            <Label htmlFor="expected-return" className="text-sm font-medium text-foreground">
              Expected Annual Return
            </Label>
            <div className="relative">
              <Input
                id="expected-return"
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="pr-7 h-11 border-input/60 focus:border-primary/40 focus:ring-primary/20 transition-colors"
                min={0}
                max={100}
                step={0.1}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                %
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {defaults.expectedReturnSource}
            </p>
          </div>
        </div>

        {/* Calculate Button */}
        <Button 
          onClick={calculateROI}
          className="w-full h-11 text-sm font-medium shadow-sm hover:shadow transition-all"
          size="lg"
        >
          Calculate Projection
        </Button>

        {/* Results Section */}
        {results && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-500">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Value */}
              <div className="bg-card border border-border/40 rounded-lg p-5 space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Total Value
                </p>
                <p className="text-2xl font-semibold text-foreground tracking-tight">
                  {formatCurrency(showNetReturns ? results.netTotalValue : results.grossTotalValue)}
                </p>
              </div>

              {/* Total Return */}
              <div className="bg-card border border-border/40 rounded-lg p-5 space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Total Return
                </p>
                <p className="text-2xl font-semibold text-success tracking-tight">
                  {formatCurrency(showNetReturns ? results.netTotalReturn : results.grossTotalReturn)}
                </p>
              </div>

              {/* Annualized Return */}
              <div className="bg-card border border-border/40 rounded-lg p-5 space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Annualized Return
                </p>
                <p className="text-2xl font-semibold text-foreground tracking-tight">
                  {formatPercentage(showNetReturns ? results.netAnnualizedReturn : results.grossAnnualizedReturn)}
                </p>
              </div>
            </div>

            {/* Growth Chart */}
            <div className="bg-card border border-border/40 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">
                  Projected Growth Over Time
                </h4>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="year" 
                    label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      fontSize: '12px',
                      paddingTop: '16px'
                    }}
                  />
                  {!showNetReturns && (
                    <Line 
                      type="monotone" 
                      dataKey="grossValue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2.5}
                      name="Gross Returns (Before Fees)"
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  )}
                  {showNetReturns && (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="grossValue" 
                        stroke="hsl(var(--muted-foreground))" 
                        strokeWidth={1.5}
                        strokeDasharray="5 5"
                        name="Gross Returns (Before Fees)"
                        dot={false}
                        opacity={0.5}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="netValue" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2.5}
                        name="Net Returns (After Fees)"
                        dot={false}
                        activeDot={{ r: 5 }}
                      />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Fee Impact Analysis */}
            {showNetReturns && results.totalFeesPaid > 0 && (
              <div className="bg-muted/30 border border-border/40 rounded-lg p-5">
                <h4 className="text-sm font-semibold text-foreground mb-4">
                  Fee Impact Analysis
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Fees Paid</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(results.totalFeesPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pl-4">
                    <span className="text-muted-foreground">Management Fees</span>
                    <span className="text-foreground">
                      {formatCurrency(results.managementFeesPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pl-4">
                    <span className="text-muted-foreground">Performance Fees</span>
                    <span className="text-foreground">
                      {formatCurrency(results.performanceFeesPaid)}
                    </span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border/40 flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Return Impact</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(results.grossTotalReturn - results.netTotalReturn)} less
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Disclaimers */}
        <div className="mt-8 pt-6 border-t border-border/50 space-y-4">
          {/* Data Source Disclaimer - only when using assumptions */}
          {!defaults.hasFundReturnData && (
            <div className="flex items-start gap-3 p-4 bg-primary-50/30 rounded-lg border border-primary-100/40">
              <Info className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-primary-800 leading-relaxed">
                <span className="font-semibold">Using Industry Assumptions:</span> This projection uses market averages as the fund hasn't specified target returns. 
                Actual performance may differ significantly. Contact the fund manager for fund-specific projections.
              </p>
            </div>
          )}
          
          {/* Legal Disclaimer */}
          <div className="flex items-start gap-3 p-4 bg-warning/5 rounded-lg border border-warning/20">
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Investment Risk Disclosure:</span> These projections are for illustrative purposes only and do not guarantee future performance. 
              Past performance is not indicative of future results. All investments carry risk, including potential loss of principal. 
              Consult with a qualified financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;