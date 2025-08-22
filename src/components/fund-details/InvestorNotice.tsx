
import React from 'react';
import { AlertCircle } from 'lucide-react';

const InvestorNotice: React.FC = () => {
  return (
    <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 flex items-start space-x-4 my-6">
      <AlertCircle className="text-warning w-6 h-6 mt-1 flex-shrink-0" />
      <div>
        <h3 className="font-medium text-warning mb-2">Important Notice for Investors</h3>
        <p className="text-warning-foreground/80 text-sm leading-relaxed">
          Investment in funds involves risks, including the possible loss of principal. Please read all fund documentation carefully before making any investment decisions. Past performance is not indicative of future results.
        </p>
      </div>
    </div>
  );
};

export default InvestorNotice;
