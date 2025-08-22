
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PremiumCTA from '../cta/PremiumCTA';

const EmptyComparison = () => {
  const navigate = useNavigate();
  
  const handleBrowseFunds = () => {
    navigate('/index');
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg shadow-sm border border-border p-10 text-center">
        <h2 className="text-2xl font-bold mb-4 text-foreground">No Funds Selected for Comparison</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          You haven't selected any funds to compare yet. Browse our collection of Portugal Golden Visa eligible funds
          and click the "Compare" button to add them to your comparison list.
        </p>
        <Button
          onClick={handleBrowseFunds}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Browse Portugal Golden Visa Investment Fund Index
        </Button>
      </div>
      
      {/* Premium CTA for comparison features */}
      <PremiumCTA variant="full" location="empty-comparison" />
    </div>
  );
};

export default EmptyComparison;
