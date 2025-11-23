import React from 'react';
import { ClipboardCheck, Filter, Users, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HowMovingtoHelpsSectionProps {
  managerName: string;
}

const HowMovingtoHelpsSection: React.FC<HowMovingtoHelpsSectionProps> = ({ managerName }) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 border-y border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            How Movingto Helps You Invest in {managerName} Funds
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We guide international investors through every step of the Portugal Golden Visa investment process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Step 1 */}
          <div className="bg-background rounded-xl p-6 border border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ClipboardCheck className="h-6 w-6 text-primary" />
            </div>
            <div className="mb-2">
              <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded mb-3">
                Step 1
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Understand Your Situation
            </h3>
            <p className="text-sm text-muted-foreground">
              We assess your citizenship, tax residency, timeline, risk tolerance, and investment objectives.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-background rounded-xl p-6 border border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Filter className="h-6 w-6 text-primary" />
            </div>
            <div className="mb-2">
              <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded mb-3">
                Step 2
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Shortlist Suitable Funds
            </h3>
            <p className="text-sm text-muted-foreground">
              We help you compare options across all managers, including {managerName}, based on your specific requirements.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-background rounded-xl p-6 border border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="mb-2">
              <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded mb-3">
                Step 3
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Coordinate Introductions
            </h3>
            <p className="text-sm text-muted-foreground">
              We connect you with the fund manager, a Portuguese bank, and a qualified immigration lawyer.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-background rounded-xl p-6 border border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <HeartHandshake className="h-6 w-6 text-primary" />
            </div>
            <div className="mb-2">
              <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded mb-3">
                Step 4
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Support Throughout
            </h3>
            <p className="text-sm text-muted-foreground">
              We provide guidance throughout the Golden Visa application process until you receive your residency.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <a href="https://www.fillout.com/t/2UtfJ8RJuNus" target="_blank" rel="noopener noreferrer">
              Get a Personalized Introduction
            </a>
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Free consultation • No obligation • Responds within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowMovingtoHelpsSection;
