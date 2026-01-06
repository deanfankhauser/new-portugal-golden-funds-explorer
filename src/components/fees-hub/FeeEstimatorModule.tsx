import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle, Calculator, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const FeeEstimatorModule: React.FC = () => {
  const [investmentAmount, setInvestmentAmount] = useState(500000);
  const [yearsHeld, setYearsHeld] = useState(6);
  const [managementFee, setManagementFee] = useState(1.5);
  const [performanceFee, setPerformanceFee] = useState(0);
  const [entryFee, setEntryFee] = useState(0);
  const [exitFee, setExitFee] = useState(0);
  const [assumedReturn, setAssumedReturn] = useState(6);

  const calculations = useMemo(() => {
    // Entry fee (one-time, upfront)
    const entryFeeCost = investmentAmount * (entryFee / 100);
    const netInvested = investmentAmount - entryFeeCost;

    // Calculate year by year with compound growth and annual fees
    let balance = netInvested;
    let totalManagementFees = 0;
    let totalPerformanceFees = 0;

    for (let year = 0; year < yearsHeld; year++) {
      // Growth for the year
      const yearGrowth = balance * (assumedReturn / 100);
      
      // Management fee on average balance (simplified)
      const yearManagementFee = balance * (managementFee / 100);
      totalManagementFees += yearManagementFee;
      
      // Performance fee on growth (if any)
      const yearPerformanceFee = yearGrowth > 0 ? yearGrowth * (performanceFee / 100) : 0;
      totalPerformanceFees += yearPerformanceFee;
      
      // End of year balance
      balance = balance + yearGrowth - yearManagementFee - yearPerformanceFee;
    }

    // Exit fee on final balance
    const exitFeeCost = balance * (exitFee / 100);
    const finalValue = balance - exitFeeCost;

    const totalFees = entryFeeCost + totalManagementFees + totalPerformanceFees + exitFeeCost;
    const netReturn = finalValue - investmentAmount;
    const netReturnPercent = (netReturn / investmentAmount) * 100;

    return {
      entryFeeCost,
      totalManagementFees,
      totalPerformanceFees,
      exitFeeCost,
      totalFees,
      finalValue,
      netReturn,
      netReturnPercent
    };
  }, [investmentAmount, yearsHeld, managementFee, performanceFee, entryFee, exitFee, assumedReturn]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <section id="estimator" className="scroll-mt-24">
      <Card className="border-border/60">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Calculator className="h-5 w-5 text-primary" />
            Estimate Total Cost
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Adjust assumptions to see how fees impact your investment over time.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              {/* Investment Amount */}
              <div className="space-y-2">
                <Label htmlFor="investment">Investment Amount (€)</Label>
                <Input
                  id="investment"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  min={100000}
                  max={5000000}
                  step={50000}
                />
              </div>

              {/* Years Held */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Years Held</Label>
                  <span className="text-sm font-medium">{yearsHeld} years</span>
                </div>
                <Slider
                  value={[yearsHeld]}
                  onValueChange={(v) => setYearsHeld(v[0])}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              {/* Assumed Return */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Assumed Annual Return</Label>
                  <span className="text-sm font-medium">{assumedReturn}%</span>
                </div>
                <Slider
                  value={[assumedReturn]}
                  onValueChange={(v) => setAssumedReturn(v[0])}
                  min={0}
                  max={15}
                  step={0.5}
                />
              </div>

              {/* Management Fee */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Management Fee (annual)</Label>
                  <span className="text-sm font-medium">{managementFee}%</span>
                </div>
                <Slider
                  value={[managementFee]}
                  onValueChange={(v) => setManagementFee(v[0])}
                  min={0}
                  max={3}
                  step={0.1}
                />
              </div>

              {/* Performance Fee */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Performance Fee (on gains)</Label>
                  <span className="text-sm font-medium">{performanceFee}%</span>
                </div>
                <Slider
                  value={[performanceFee]}
                  onValueChange={(v) => setPerformanceFee(v[0])}
                  min={0}
                  max={25}
                  step={1}
                />
              </div>

              {/* Entry/Exit Fees */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Entry Fee</Label>
                    <span className="text-sm font-medium">{entryFee}%</span>
                  </div>
                  <Slider
                    value={[entryFee]}
                    onValueChange={(v) => setEntryFee(v[0])}
                    min={0}
                    max={5}
                    step={0.5}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Exit Fee</Label>
                    <span className="text-sm font-medium">{exitFee}%</span>
                  </div>
                  <Slider
                    value={[exitFee]}
                    onValueChange={(v) => setExitFee(v[0])}
                    min={0}
                    max={5}
                    step={0.5}
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  Estimated Outcome
                </h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">Entry Fee</span>
                    <span className="font-medium text-foreground">{formatCurrency(calculations.entryFeeCost)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">Total Management Fees</span>
                    <span className="font-medium text-foreground">{formatCurrency(calculations.totalManagementFees)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">Total Performance Fees</span>
                    <span className="font-medium text-foreground">{formatCurrency(calculations.totalPerformanceFees)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">Exit Fee</span>
                    <span className="font-medium text-foreground">{formatCurrency(calculations.exitFeeCost)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 bg-destructive/10 rounded-md px-3 -mx-3">
                    <span className="font-medium text-foreground">Total Fees Paid</span>
                    <span className="font-bold text-destructive">{formatCurrency(calculations.totalFees)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estimated Final Value</span>
                    <span className="font-semibold text-lg text-foreground">{formatCurrency(calculations.finalValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Net Return</span>
                    <span className={`font-medium ${calculations.netReturn >= 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                      {formatCurrency(calculations.netReturn)} ({calculations.netReturnPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              <Alert variant="default" className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-xs text-amber-800 dark:text-amber-200">
                  This is an illustrative estimate only. Actual fees, returns, and outcomes will vary. 
                  Always verify fee terms in official fund documents before investing.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FeeEstimatorModule;
