import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CompareModule: React.FC = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Compare Funds Side-by-Side
      </h2>
      
      <Card className="border border-border/60 bg-gradient-to-br from-card to-muted/20">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Not sure which fund fits best?
              </h3>
              <p className="text-muted-foreground max-w-md">
                Use our comparison tool to evaluate funds side-by-side on fees, liquidity, 
                minimums, and governance signals.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/compare">
                <Button size="lg" className="w-full sm:w-auto">
                  Compare Funds
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/comparisons">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Comparisons
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Quick links to popular comparisons could go here */}
          <div className="mt-6 pt-6 border-t border-border/40">
            <p className="text-sm text-muted-foreground mb-3">Popular comparison categories:</p>
            <div className="flex flex-wrap gap-2">
              <Link to="/categories/debt" className="text-sm text-primary hover:underline">
                Debt funds
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link to="/categories/venture-capital" className="text-sm text-primary hover:underline">
                Venture Capital funds
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link to="/categories/private-equity" className="text-sm text-primary hover:underline">
                Private Equity funds
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link to="/tags/no-lock-up" className="text-sm text-primary hover:underline">
                No lock-up funds
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CompareModule;
