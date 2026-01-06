import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const mistakes = [
  {
    title: 'Ignoring liquidity and lock-up terms',
    description: 'Many investors focus on returns without considering when they can access their capital. A 7-year lock-up with no early redemption is very different from quarterly liquidity.'
  },
  {
    title: 'Comparing headline fees without checking performance fee hurdles',
    description: 'A fund with 2% management + 20% performance fee above 8% hurdle may be cheaper than one with 1.5% management + 20% performance from first dollar.'
  },
  {
    title: 'Assuming "GV eligible" means "good investment"',
    description: 'Golden Visa eligibility is a regulatory status, not a quality indicator. Many eligible funds exist—your job is to compare them on their merits.'
  },
  {
    title: 'Not checking reporting cadence and transparency',
    description: 'How often will you receive NAV updates and investor reports? Monthly reporting gives you better visibility than annual-only updates.'
  },
  {
    title: 'Overweighting marketing materials versus legal terms',
    description: 'Glossy presentations highlight best-case scenarios. The fund prospectus and subscription agreement contain the actual terms and risks.'
  }
];

const CommonMistakes: React.FC = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Common Mistakes When Choosing a GV Fund
      </h2>
      
      <Card className="border border-border/60 bg-card">
        <CardContent className="p-6">
          <div className="space-y-5">
            {mistakes.map((mistake, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="p-1.5 bg-amber-500/10 rounded-full">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-medium text-foreground mb-1">
                    {mistake.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {mistake.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CommonMistakes;
