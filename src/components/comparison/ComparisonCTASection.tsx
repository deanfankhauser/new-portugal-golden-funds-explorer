import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ComparisonCTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-2xl border border-border p-8 text-center mb-12">
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Ready to invest?
      </h3>
      <p className="text-[15px] text-muted-foreground mb-6 max-w-md mx-auto">
        Speak with our Golden Visa experts to discuss which fund is right for you.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          size="lg"
          className="bg-gradient-to-br from-primary to-primary-700 hover:from-primary/90 hover:to-primary-700/90 shadow-md"
          onClick={() => navigate('/contact')}
        >
          Book a Consultation
        </Button>
        <Button 
          size="lg"
          variant="outline"
          onClick={() => window.print()}
        >
          Download Comparison PDF
        </Button>
      </div>
    </div>
  );
};

export default ComparisonCTASection;
