import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

const CAN_HELP_WITH = [
  'Onboarding process questions',
  'Documentation requirements',
  'KYC/AML procedures',
  'General fund inquiries',
  'Subscription process guidance'
];

const CANNOT_HELP_WITH = [
  'Investment advice or recommendations',
  'Legal or tax advice',
  'Performance guarantees',
  'Personalized financial guidance',
  'Suitability assessments'
];

export const ScopeAndBoundaries: React.FC = () => {
  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        What to Expect
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Can Help With */}
        <Card className="bg-green-500/5 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <div className="p-1 rounded-full bg-green-500/10">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              Can help with
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {CAN_HELP_WITH.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Cannot Help With */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <div className="p-1 rounded-full bg-muted">
                <X className="h-4 w-4 text-muted-foreground" />
              </div>
              Cannot help with
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {CANNOT_HELP_WITH.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
