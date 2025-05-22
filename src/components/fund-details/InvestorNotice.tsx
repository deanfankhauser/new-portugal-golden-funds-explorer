
import React from 'react';
import { AlertCircle } from 'lucide-react';

const InvestorNotice: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex items-start space-x-4">
      <AlertCircle className="text-blue-500 w-6 h-6 mt-1 flex-shrink-0" />
      <div>
        <h3 className="font-medium text-blue-700 mb-2">Important Notice for Investors</h3>
        <p className="text-blue-800 text-sm leading-relaxed">
          Investment in funds involves risks, including the possible loss of principal. Please read all fund documentation carefully before making any investment decisions. Past performance is not indicative of future results.
        </p>
      </div>
    </div>
  );
};

export default InvestorNotice;
