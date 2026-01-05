import React from 'react';
import { Info, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const USDefinitionBlock: React.FC = () => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        What "US person eligible" means here
      </h2>
      
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Confirmed by documentation:</strong> Status is based on fund/manager documents or written confirmation we have collected.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Subject to change:</strong> Eligibility policies can change. Always verify directly with the fund before subscribing.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Not advice:</strong> This is not investment, legal, or tax advice. Consult qualified professionals.
              </span>
            </li>
          </ul>
          
          <div className="mt-6 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground italic">
              Movingto Funds is a directory and comparison platform. "US person eligible" reflects collected disclosures or confirmations and may change. This is not investment, legal, or tax advice. Verify in official documents.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default USDefinitionBlock;
