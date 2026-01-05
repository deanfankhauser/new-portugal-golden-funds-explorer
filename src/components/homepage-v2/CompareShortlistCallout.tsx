import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CompareShortlistCallout: React.FC = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Compare Card */}
          <div className="bg-card rounded-xl border border-border p-6 sm:p-8 hover:border-primary/30 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Compare 2–4 funds
            </h3>
            <p className="text-muted-foreground mb-6">
              See how funds stack up side-by-side on fees, risk, liquidity, and more.
            </p>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/compare">
                Compare now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Shortlist Card */}
          <div className="bg-card rounded-xl border border-border p-6 sm:p-8 hover:border-primary/30 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Shortlist and request an intro
            </h3>
            <p className="text-muted-foreground mb-6">
              Save funds you're interested in, then reach out directly to managers.
            </p>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to="/saved-funds">
                View shortlist
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompareShortlistCallout;
