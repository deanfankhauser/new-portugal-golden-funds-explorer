import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Scale, Clock, Shield, Coins } from 'lucide-react';

const RankingMethodology: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const factors = [
    {
      icon: Coins,
      label: 'Total Fees',
      weight: '35%',
      description: 'Combined management and performance fees (where disclosed)'
    },
    {
      icon: Clock,
      label: 'Liquidity Terms',
      weight: '35%',
      description: 'Lock-up period length and redemption frequency'
    },
    {
      icon: Shield,
      label: 'Governance Signals',
      weight: '20%',
      description: 'CMVM registration, auditor, custodian, reporting cadence'
    },
    {
      icon: Scale,
      label: 'Minimum Investment',
      weight: '10%',
      description: 'Subscription minimum relative to €500k threshold'
    }
  ];
  
  return (
    <Card className="border border-border/60 bg-card">
      <CardContent className="p-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors"
        >
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              How We Rank Funds on This Page
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Objective scoring based on disclosed factors only
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-border/40">
            <div className="pt-6 space-y-4">
              {/* Scoring factors */}
              <div className="grid sm:grid-cols-2 gap-4">
                {factors.map((factor) => (
                  <div 
                    key={factor.label}
                    className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <factor.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{factor.label}</span>
                        <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                          {factor.weight}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {factor.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Data completeness note */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-sm text-foreground/80">
                  <strong>Data completeness:</strong> Funds with incomplete data in key fields are excluded from the shortlist. 
                  We only rank funds where we can verify the scoring inputs.
                </p>
              </div>
              
              {/* Disclaimer */}
              <div className="p-4 bg-muted/30 rounded-lg border border-border/40">
                <p className="text-sm text-muted-foreground">
                  <strong>Important:</strong> Movingto Funds provides a directory and comparison tools. 
                  This page is a shortlist based on disclosed factors and does not constitute investment, legal, or tax advice. 
                  Always review official fund documents and seek licensed advice for your situation.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RankingMethodology;
