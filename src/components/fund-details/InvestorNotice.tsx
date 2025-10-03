
import React from 'react';
import { AlertCircle } from 'lucide-react';

const InvestorNotice: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-2 border-destructive/20 rounded-xl p-6 flex items-start gap-4 my-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="p-2 rounded-lg bg-destructive/10 shrink-0">
        <AlertCircle className="text-destructive w-5 h-5" />
      </div>
      <div>
        <h3 className="font-bold text-foreground mb-2 text-lg">Important Notice for Investors</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Investment in funds involves risks, including the possible loss of principal. Please read all fund documentation carefully before making any investment decisions. Past performance is not indicative of future results.
        </p>
      </div>
    </div>
  );
};

export default InvestorNotice;
