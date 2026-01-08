import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight } from 'lucide-react';

const EmptyComparison = () => {
  return (
    <div className="bg-card rounded-xl border border-border p-8 md:p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      
      <h2 className="text-xl md:text-2xl font-bold mb-3 text-foreground">
        No Funds Selected
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm md:text-base">
        Browse our directory of Portugal Golden Visa investment funds and click "Compare" to add them to your comparison.
      </p>
      
      <Button asChild size="lg" className="gap-2">
        <Link to="/">
          Browse All Funds
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
};

export default EmptyComparison;
