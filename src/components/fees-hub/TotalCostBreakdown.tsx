import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Repeat, TrendingUp, ArrowRight } from 'lucide-react';

const costTypes = [
  {
    icon: CreditCard,
    title: 'One-off Fees',
    description: 'Entry/subscription fee, setup costs, legal fees',
    timing: 'Paid upfront when you invest',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    icon: Repeat,
    title: 'Ongoing Fees',
    description: 'Management fee, admin fee, depositary fee',
    timing: 'Deducted annually from fund value',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  {
    icon: TrendingUp,
    title: 'Outcome-based Fees',
    description: 'Performance fee, carried interest',
    timing: 'Charged on gains above hurdle rate',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10'
  }
];

export const TotalCostBreakdown: React.FC = () => {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        What You Actually Pay Over Time
      </h2>
      <p className="text-muted-foreground mb-6">
        Fund fees fall into three categories. Understanding each helps you compare true costs.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {costTypes.map((type, index) => (
          <React.Fragment key={type.title}>
            <Card className="border-border/60">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-lg ${type.bgColor} flex items-center justify-center mb-4`}>
                  <type.icon className={`h-5 w-5 ${type.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {type.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {type.description}
                </p>
                <p className="text-xs text-muted-foreground/80 italic">
                  {type.timing}
                </p>
              </CardContent>
            </Card>
            {index < costTypes.length - 1 && (
              <div className="hidden md:flex items-center justify-center -mx-6">
                <ArrowRight className="h-5 w-5 text-muted-foreground/40" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/40">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Example scenario:</strong> On a €500,000 subscription with 1.5% annual management fee, 
          20% performance fee (above 6% hurdle), and 2% entry fee, total fees over 6 years can range from €55,000 to €85,000+ 
          depending on returns. Use the estimator above to model your scenario.
        </p>
      </div>
    </section>
  );
};

export default TotalCostBreakdown;
