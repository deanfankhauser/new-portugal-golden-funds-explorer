import React from 'react';
import { Target, TrendingUp, Shield } from 'lucide-react';
import { Profile } from '@/types/profile';
import { Fund } from '@/data/types/funds';

interface InvestmentPhilosophySectionProps {
  managerName: string;
  managerProfile: Profile | null;
  managerFunds: Fund[];
}

const InvestmentPhilosophySection: React.FC<InvestmentPhilosophySectionProps> = ({ 
  managerName, 
  managerProfile,
  managerFunds 
}) => {
  // Try to infer strategy from fund categories
  const categories = [...new Set(managerFunds.map(f => f.category).filter(Boolean))];
  const categoryText = categories.length > 0 
    ? categories.join(', ').toLowerCase() 
    : 'diversified investment strategies';

  // Try to infer risk profile from fund tags
  const allTags = managerFunds.flatMap(f => f.tags || []);
  const hasLowRisk = allTags.some(t => t.toLowerCase().includes('low-risk') || t.toLowerCase() === 'capital preservation');
  const hasMediumRisk = allTags.some(t => t.toLowerCase().includes('medium-risk') || t.toLowerCase().includes('balanced'));
  const hasHighRisk = allTags.some(t => t.toLowerCase().includes('high-risk') || t.toLowerCase() === 'capital growth');

  let riskDescription = 'defined risk levels';
  if (hasLowRisk && !hasMediumRisk && !hasHighRisk) {
    riskDescription = 'a focus on capital preservation and lower-risk strategies';
  } else if (hasMediumRisk) {
    riskDescription = 'balanced growth objectives with moderate risk management';
  } else if (hasHighRisk) {
    riskDescription = 'growth-oriented strategies with higher risk-return profiles';
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-3xl font-semibold text-foreground">
            Investment Philosophy & Risk Profile
          </h2>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-foreground/80 leading-relaxed text-lg mb-6">
            {managerName} focuses on {categoryText} for Golden Visa investors, operating through 
            regulated funds with transparent reporting and {riskDescription}.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-muted/30 rounded-lg p-5 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">Strategy Focus</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {categories.length > 0 
                  ? `Specialized in ${categoryText} investments.`
                  : 'Diversified investment approach across multiple asset classes.'
                }
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-5 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">Risk Management</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                All funds operate under CMVM regulation with established risk management frameworks.
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-5 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">Investor Profile</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Designed for international investors seeking Portuguese residency through the Golden Visa program.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentPhilosophySection;
