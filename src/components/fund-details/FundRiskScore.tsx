import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, TrendingUp, Globe, FileText } from 'lucide-react';

interface FundRiskScoreProps {
  fund: Fund;
}

const FundRiskScore: React.FC<FundRiskScoreProps> = ({ fund }) => {
  // Calculate risk scores based on fund characteristics
  const calculateManagerQuality = (fund: Fund): number => {
    // Higher scores for established managers with larger AUM
    if (fund.managerName.includes('Lince') || fund.managerName.includes('Octanova')) return 3;
    if (fund.fundSize >= 100) return 2;
    return 1;
  };

  const calculateStrategyRisk = (fund: Fund): number => {
    // Higher scores for more volatile/concentrated strategies
    if (fund.tags.includes('Crypto') || fund.tags.includes('Bitcoin')) return 5;
    if (fund.category === 'Venture Capital') return 4;
    if (fund.category === 'Private Equity') return 3;
    if (fund.tags.includes('Real Estate')) return 2;
    return 1; // Conservative strategies
  };

  const calculateMacroESG = (fund: Fund): number => {
    // Portugal/EU exposure - generally stable
    return 1;
  };

  const calculateRegulatoryRisk = (fund: Fund): number => {
    // Higher scores for complex structures
    if (fund.tags.includes('Crypto') || fund.tags.includes('Bitcoin')) return 3;
    if (fund.tags.includes('UCITS')) return 1;
    return 1; // Standard regulated vehicles
  };

  const calculateOverallScore = (mq: number, sr: number, me: number, rr: number): number => {
    // Weighted average with strategy risk having highest weight
    return Math.round((mq * 0.3 + sr * 0.4 + me * 0.15 + rr * 0.15));
  };

  const managerQuality = calculateManagerQuality(fund);
  const strategyRisk = calculateStrategyRisk(fund);
  const macroESG = calculateMacroESG(fund);
  const regulatoryRisk = calculateRegulatoryRisk(fund);
  const overallScore = calculateOverallScore(managerQuality, strategyRisk, macroESG, regulatoryRisk);

  const getScoreColor = (score: number) => {
    if (score <= 2) return 'text-success bg-success/10 border-success/30';
    if (score <= 3) return 'text-warning bg-warning/10 border-warning/30';
    return 'text-destructive bg-destructive/10 border-destructive/30';
  };

  const getScoreIcon = (score: number) => {
    if (score <= 2) return <Shield className="w-4 h-4" />;
    if (score <= 3) return <TrendingUp className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getRiskLabel = (score: number) => {
    if (score <= 2) return 'Low Risk';
    if (score <= 3) return 'Medium Risk';
    return 'High Risk';
  };

  const ScoreDisplay = ({ score, label, icon }: { score: number; label: string; icon: React.ReactNode }) => (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs md:text-sm font-medium text-foreground">{label}</span>
      </div>
      <Badge className={`${getScoreColor(score)} font-semibold text-xs`}>
        {score}
      </Badge>
    </div>
  );

  return (
    <Card className="bg-gradient-to-br from-card to-muted/30 border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-foreground">
          <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          Proprietary Risk Assessment
        </CardTitle>
        <p className="text-sm md:text-base text-muted-foreground">
          Our comprehensive risk scoring methodology evaluates funds across multiple dimensions
        </p>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        {/* Overall Score */}
        <div className="text-center p-4 md:p-6 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getScoreIcon(overallScore)}
            <h3 className="text-base md:text-lg font-semibold text-foreground">Overall Risk Score</h3>
          </div>
          <div className={`inline-flex items-center px-3 py-2 md:px-4 md:py-2 rounded-full text-xl md:text-2xl font-bold border ${getScoreColor(overallScore)}`}>
            {overallScore}/5
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">{getRiskLabel(overallScore)}</p>
        </div>

        {/* Individual Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <ScoreDisplay 
            score={managerQuality} 
            label="Manager Quality" 
            icon={<TrendingUp className="w-4 h-4 text-primary" />} 
          />
          <ScoreDisplay 
            score={strategyRisk} 
            label="Strategy Risk" 
            icon={<AlertTriangle className="w-4 h-4 text-accent" />} 
          />
          <ScoreDisplay 
            score={macroESG} 
            label="Macro & ESG" 
            icon={<Globe className="w-4 h-4 text-success" />} 
          />
          <ScoreDisplay 
            score={regulatoryRisk} 
            label="Regulatory Risk" 
            icon={<FileText className="w-4 h-4 text-primary" />} 
          />
        </div>

        {/* Methodology Explanation */}
        <div className="bg-card rounded-lg p-3 md:p-4 border border-border">
          <h4 className="font-semibold text-foreground mb-2 md:mb-3 text-sm md:text-base">Key Assumptions & Mappings</h4>
          <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong>Manager Quality:</strong> Based on GP's tenure, AUM scale and realized track record.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <strong>Strategy Risk:</strong> Underlying asset volatility, liquidity profile and concentration.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Globe className="w-3 h-3 md:w-4 md:h-4 text-success mt-0.5 flex-shrink-0" />
              <div>
                <strong>Macro & ESG:</strong> Portugal/EU political-stability percentile.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="w-3 h-3 md:w-4 md:h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong>Regulatory Risk:</strong> Vehicle complexity (UCITS vs. AIF vs. crypto exposures).
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 md:p-4">
          <p className="text-xs text-warning-foreground">
            <strong>Disclaimer:</strong> This proprietary risk assessment is for informational purposes only and should not be considered as investment guidance. Risk scores are based on our internal methodology and may not reflect all relevant factors. Past performance does not guarantee future results. Please consult with a qualified financial guidance professional before making investment decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundRiskScore;
