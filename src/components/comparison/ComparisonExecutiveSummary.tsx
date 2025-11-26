import React from 'react';
import { Fund } from '@/data/types/funds';
import { Card, CardContent } from '@/components/ui/card';
import { calculateRiskBand } from '@/utils/riskCalculation';

interface ComparisonExecutiveSummaryProps {
  fund1: Fund;
  fund2: Fund;
}

const ComparisonExecutiveSummary: React.FC<ComparisonExecutiveSummaryProps> = ({ fund1, fund2 }) => {
  const risk1 = calculateRiskBand(fund1);
  const risk2 = calculateRiskBand(fund2);
  
  const redemptionFreq1 = fund1.redemptionTerms?.frequency || 'quarterly';
  const redemptionFreq2 = fund2.redemptionTerms?.frequency || 'quarterly';
  
  const lockup1 = fund1.redemptionTerms?.minimumHoldingPeriod || 0;
  const lockup2 = fund2.redemptionTerms?.minimumHoldingPeriod || 0;
  
  const categoriesDiffer = fund1.category !== fund2.category;

  return (
    <Card className="mb-8 border-accent/20">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          {fund1.name} vs {fund2.name}: Key Differences
        </h2>
        
        <div className="space-y-3 text-muted-foreground">
          {categoriesDiffer ? (
            <p>
              This is a comparison between a <span className="font-semibold text-foreground">{fund1.category}</span> strategy 
              and a <span className="font-semibold text-foreground">{fund2.category}</span> strategy.
            </p>
          ) : (
            <p>
              Both funds follow a <span className="font-semibold text-foreground">{fund1.category}</span> strategy 
              but differ in their approach and terms.
            </p>
          )}
          
          <p>
            Choose <span className="font-semibold text-accent">{fund1.name}</span> if you prioritize{' '}
            <span className="font-semibold text-foreground">{risk1.toLowerCase()}</span> risk and{' '}
            <span className="font-semibold text-foreground">{redemptionFreq1}</span> redemptions.
          </p>
          
          <p>
            Choose <span className="font-semibold text-accent">{fund2.name}</span> if you prefer{' '}
            <span className="font-semibold text-foreground">{risk2.toLowerCase()}</span> risk and{' '}
            <span className="font-semibold text-foreground">{lockup2}</span>-month lock-up terms.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonExecutiveSummary;
