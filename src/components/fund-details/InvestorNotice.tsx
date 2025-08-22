
import React from 'react';
import { AlertCircle } from 'lucide-react';

const InvestorNotice: React.FC = () => {
  return (
    <div className="bg-bordeaux-50 border-2 border-bordeaux-200 rounded-xl p-6 flex items-start space-x-4 my-6 shadow-sm">
      <AlertCircle className="text-bordeaux-700 w-6 h-6 mt-1 flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-bordeaux-800 mb-2">Important Notice for Investors</h3>
        <p className="text-bordeaux-700 text-sm leading-relaxed">
          Investment in funds involves risks, including the possible loss of principal. Please read all fund documentation carefully before making any investment decisions. Past performance is not indicative of future results.
        </p>
      </div>
    </div>
  );
};

export default InvestorNotice;
