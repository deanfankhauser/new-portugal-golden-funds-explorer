import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Check } from 'lucide-react';

const traps = [
  {
    trap: 'Headline management fee excludes admin/depositary costs',
    tip: 'Ask for the Total Expense Ratio (TER) to see the full annual cost'
  },
  {
    trap: 'Performance fee terms matter—hurdle rates and high-water marks vary',
    tip: 'Confirm whether fees only apply above a minimum return threshold'
  },
  {
    trap: 'Liquidity costs show up at exit, not upfront',
    tip: 'Check redemption fees and notice periods before committing'
  },
  {
    trap: 'Different share classes have different fee structures',
    tip: 'Verify which share class applies to your investment amount'
  },
  {
    trap: 'Some fees are quoted ex-VAT or may change during fund life',
    tip: 'Confirm if VAT applies and whether fees are fixed for the fund term'
  }
];

export const FeeCommonTraps: React.FC = () => {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Common Fee Comparison Traps
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Avoid these mistakes when comparing fund costs
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {traps.map((item, index) => (
            <li key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-destructive">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {item.trap}
                </p>
                <div className="flex items-start gap-1.5 mt-1">
                  <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {item.tip}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default FeeCommonTraps;
