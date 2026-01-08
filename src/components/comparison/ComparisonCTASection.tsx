import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { buildContactUrl, openExternalLink } from '@/utils/urlHelpers';

const ComparisonCTASection: React.FC = () => {
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
          className="bg-gradient-to-br from-primary to-primary-700 hover:from-primary/90 hover:to-primary-700/90 shadow-md gap-2"
          onClick={() => openExternalLink(buildContactUrl('comparison-cta'))}
        >
          Book a Consultation
          <ExternalLink className="w-4 h-4" />
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
