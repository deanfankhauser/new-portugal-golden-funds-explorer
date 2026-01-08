import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Calculator, Info, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CalculationResult {
  method: string;
  annualTax: number;
  effectiveRate: number;
  description: string;
  pros: string[];
  cons: string[];
  color: string;
  recommended?: boolean;
}

const PFICCalculator: React.FC = () => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(500000);
  const [annualReturn, setAnnualReturn] = useState<number>(7);
  const [taxRate, setTaxRate] = useState<number>(37);
  const [ordinaryIncomePercent, setOrdinaryIncomePercent] = useState<number>(30);

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}m`;
    }
    if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}k`;
    }
    return `€${value.toFixed(0)}`;
  };

  const formatUSD = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculations = useMemo((): CalculationResult[] => {
    const annualGain = investmentAmount * (annualReturn / 100);
    const ordinaryIncome = annualGain * (ordinaryIncomePercent / 100);
    const capitalGains = annualGain - ordinaryIncome;

    // QEF Election: Ordinary income taxed at marginal rate, capital gains at 20%
    const qefTax = (ordinaryIncome * (taxRate / 100)) + (capitalGains * 0.20);
    const qefEffectiveRate = (qefTax / annualGain) * 100;

    // Mark-to-Market: All gains taxed as ordinary income
    const mtmTax = annualGain * (taxRate / 100);
    const mtmEffectiveRate = taxRate;

    // Default PFIC (Excess Distribution): Complex calculation with interest charges
    // Simplified: gains taxed at highest marginal rate + 3% interest approximation
    const defaultPficTax = annualGain * ((taxRate / 100) + 0.03);
    const defaultPficEffectiveRate = ((taxRate + 3) / annualGain) * annualGain;

    return [
      {
        method: 'QEF Election',
        annualTax: qefTax,
        effectiveRate: qefEffectiveRate,
        description: 'Current income inclusion with favorable capital gains treatment',
        pros: [
          'Long-term capital gains taxed at 20%',
          'No interest charges or penalties',
          'Clean annual compliance',
        ],
        cons: [
          'Requires PFIC Annual Information Statement',
          'Tax due annually even without distributions',
          'Fund must provide required documentation',
        ],
        color: 'text-emerald-600 dark:text-emerald-400',
        recommended: qefTax <= mtmTax && qefTax <= defaultPficTax,
      },
      {
        method: 'Mark-to-Market',
        annualTax: mtmTax,
        effectiveRate: mtmEffectiveRate,
        description: 'Annual mark-to-market gains taxed as ordinary income',
        pros: [
          'No special fund documentation required',
          'Simpler compliance than QEF',
          'Available for marketable stock',
        ],
        cons: [
          'All gains taxed at ordinary income rates',
          'Must be publicly traded (limited availability)',
          'Tax due on paper gains',
        ],
        color: 'text-blue-600 dark:text-blue-400',
        recommended: mtmTax < qefTax && mtmTax <= defaultPficTax,
      },
      {
        method: 'Default PFIC (Excess Distribution)',
        annualTax: defaultPficTax,
        effectiveRate: defaultPficEffectiveRate,
        description: 'No election made—punitive excess distribution regime applies',
        pros: [
          'No annual action required',
        ],
        cons: [
          'Highest effective tax rate',
          'Interest charges on deferred tax',
          'Complex calculation at disposition',
          'No capital gains treatment',
        ],
        color: 'text-red-600 dark:text-red-400',
        recommended: false,
      },
    ];
  }, [investmentAmount, annualReturn, taxRate, ordinaryIncomePercent]);

  const lowestTax = Math.min(...calculations.map(c => c.annualTax));

  return (
    <section id="calculator" className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">PFIC Tax Impact Calculator</h2>
      </div>

      <p className="text-muted-foreground mb-6">
        Estimate your annual U.S. tax burden under different PFIC election methods. 
        This tool helps illustrate the potential differences—consult a tax professional for your specific situation.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Investment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Investment Amount */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="investment" className="flex items-center gap-2">
                  Investment Amount
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Total amount invested in the PFIC fund (in EUR)</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <span className="font-mono text-sm font-medium">{formatCurrency(investmentAmount)}</span>
              </div>
              <Slider
                id="investment"
                min={100000}
                max={2000000}
                step={50000}
                value={[investmentAmount]}
                onValueChange={(value) => setInvestmentAmount(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>€100k</span>
                <span>€2m</span>
              </div>
            </div>

            {/* Annual Return */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="return" className="flex items-center gap-2">
                  Expected Annual Return
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Projected annual return from the fund</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <span className="font-mono text-sm font-medium">{annualReturn}%</span>
              </div>
              <Slider
                id="return"
                min={1}
                max={15}
                step={0.5}
                value={[annualReturn]}
                onValueChange={(value) => setAnnualReturn(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Tax Rate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="taxrate" className="flex items-center gap-2">
                  Your Marginal Tax Rate
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Your federal marginal income tax bracket (2024 rates: 10-37%)</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <span className="font-mono text-sm font-medium">{taxRate}%</span>
              </div>
              <Slider
                id="taxrate"
                min={10}
                max={37}
                step={1}
                value={[taxRate]}
                onValueChange={(value) => setTaxRate(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10%</span>
                <span>37%</span>
              </div>
            </div>

            {/* Ordinary Income Percent (for QEF) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="ordinary" className="flex items-center gap-2">
                  Ordinary Income Portion (QEF)
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Under QEF, the fund's earnings are split into ordinary income and capital gains. 
                        This percentage represents the ordinary income portion (varies by fund).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <span className="font-mono text-sm font-medium">{ordinaryIncomePercent}%</span>
              </div>
              <Slider
                id="ordinary"
                min={0}
                max={100}
                step={5}
                value={[ordinaryIncomePercent]}
                onValueChange={(value) => setOrdinaryIncomePercent(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0% (all cap gains)</span>
                <span>100% (all ordinary)</span>
              </div>
            </div>

            {/* Annual Gain Display */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated Annual Gain:</span>
                <span className="font-mono font-semibold text-foreground">
                  {formatUSD(investmentAmount * (annualReturn / 100))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tax Comparison Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {calculations.map((calc) => (
              <div
                key={calc.method}
                className={`p-4 rounded-lg border ${
                  calc.annualTax === lowestTax
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-semibold ${calc.color}`}>{calc.method}</h4>
                    {calc.annualTax === lowestTax && (
                      <Badge variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Lowest Tax
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`font-mono text-lg font-bold ${calc.color}`}>
                      {formatUSD(calc.annualTax)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ~{calc.effectiveRate.toFixed(1)}% effective rate
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{calc.description}</p>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Pros:</span>
                    <ul className="mt-1 space-y-0.5">
                      {calc.pros.slice(0, 2).map((pro, i) => (
                        <li key={i} className="text-muted-foreground">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-red-600 dark:text-red-400 font-medium">Cons:</span>
                    <ul className="mt-1 space-y-0.5">
                      {calc.cons.slice(0, 2).map((con, i) => (
                        <li key={i} className="text-muted-foreground">• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}

            {/* Savings Callout */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Potential annual savings with best election:</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatUSD(Math.max(...calculations.map(c => c.annualTax)) - lowestTax)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Card className="mt-6 border-amber-500/30 bg-amber-500/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-amber-700 dark:text-amber-300 mb-1">
                For Illustration Purposes Only
              </p>
              <p>
                This calculator provides simplified estimates and does not account for state taxes, 
                Net Investment Income Tax (NIIT), currency conversion, or the complex "excess distribution" 
                calculation. Actual tax liability depends on your specific circumstances, holding period, 
                and fund characteristics. Consult a qualified U.S. tax professional.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PFICCalculator;
