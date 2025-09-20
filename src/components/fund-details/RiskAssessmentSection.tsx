import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Fund } from '../../data/types/funds';
import { calculateRiskScore } from '../../utils/riskCalculation';

interface RiskAssessmentSectionProps {
  fund: Fund;
}

const RiskAssessmentSection: React.FC<RiskAssessmentSectionProps> = ({ fund }) => {
  const riskScore = calculateRiskScore(fund);
  
  const riskLabels = {
    1: { label: 'Very Low Risk', color: 'bg-green-100 text-green-800', description: 'Capital preservation focused' },
    2: { label: 'Low Risk', color: 'bg-green-50 text-green-700', description: 'Conservative investments' },
    3: { label: 'Low-Medium Risk', color: 'bg-yellow-50 text-yellow-700', description: 'Mostly stable assets' },
    4: { label: 'Medium Risk', color: 'bg-orange-50 text-orange-700', description: 'Balanced risk-return' },
    5: { label: 'Medium-High Risk', color: 'bg-orange-100 text-orange-800', description: 'Growth focused' },
    6: { label: 'High Risk', color: 'bg-red-50 text-red-700', description: 'Aggressive strategies' },
    7: { label: 'Very High Risk', color: 'bg-red-100 text-red-800', description: 'Speculative investments' }
  };

  const currentRisk = riskLabels[riskScore as keyof typeof riskLabels];

  const getDrawdownWindow = (fund: Fund): string => {
    if (fund.tags.includes('Crypto') || fund.tags.includes('Venture Capital')) return '6-18 months';
    if (fund.category === 'Real Estate' || fund.category === 'Infrastructure') return '3-12 months';
    return '1-6 months';
  };

  const getGatingPolicy = (fund: Fund): string => {
    if (fund.tags.includes('Crypto') || fund.tags.includes('Venture Capital')) {
      return 'Redemptions may be suspended during market stress';
    }
    if (fund.category === 'Real Estate') {
      return 'Side pockets may apply for illiquid assets';
    }
    return 'Standard redemption gates may apply in extreme conditions';
  };

  return (
    <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-foreground">
          <AlertTriangle className="w-5 h-5 mr-2 text-primary" />
          Risk Assessment
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Risk Scale */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">Risk Level</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Risk assessment based on asset class, strategy, and fee structure</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Risk Scale Visual */}
          <div className="flex items-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7].map((level) => (
              <div key={level} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    level === riskScore 
                      ? 'border-primary bg-primary' 
                      : level < riskScore 
                        ? 'border-muted bg-muted' 
                        : 'border-muted-foreground/20 bg-transparent'
                  }`}
                />
                <span className="text-xs text-muted-foreground mt-1">{level}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <Badge className={`${currentRisk.color} border-0`}>
              {currentRisk.label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {currentRisk.description}
            </span>
          </div>
        </div>

        {/* Risk Characteristics */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Typical Drawdown Window</h4>
            <p className="text-sm text-muted-foreground">
              {getDrawdownWindow(fund)}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Liquidity Management</h4>
            <p className="text-sm text-muted-foreground">
              {getGatingPolicy(fund)}
            </p>
          </div>
        </div>

        {/* Risk Factors */}
        <div>
          <h4 className="font-medium text-foreground mb-2">Key Risk Factors</h4>
          <div className="flex flex-wrap gap-2">
            {fund.tags.includes('Crypto') && (
              <Badge variant="outline" className="text-xs">Cryptocurrency Volatility</Badge>
            )}
            {fund.tags.includes('Venture Capital') && (
              <Badge variant="outline" className="text-xs">Illiquidity Risk</Badge>
            )}
            {fund.category === 'Real Estate' && (
              <Badge variant="outline" className="text-xs">Property Market Risk</Badge>
            )}
            {fund.performanceFee >= 20 && (
              <Badge variant="outline" className="text-xs">Performance Concentration</Badge>
            )}
            {!fund.tags.includes('UCITS') && (
              <Badge variant="outline" className="text-xs">Regulatory Risk</Badge>
            )}
            {fund.minimumInvestment >= 100000 && (
              <Badge variant="outline" className="text-xs">High Minimum Investment</Badge>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Risk Disclaimer:</strong> This risk assessment is indicative only and based on fund characteristics. 
            Past performance and risk metrics do not guarantee future results. All investments carry risk of loss. 
            Consult your financial advisor before investing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskAssessmentSection;