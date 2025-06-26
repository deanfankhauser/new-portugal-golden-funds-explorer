
import React from 'react';
import { Calendar, TrendingUp, Shield, Award } from 'lucide-react';

const FundIndexHeader: React.FC = () => {
  return (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
        <Award className="h-4 w-4" />
        Updated for 2025
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
        2025 Golden Visa
        <br />
        <span className="text-blue-600">Fund Index</span>
      </h1>
      
      <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        The definitive, data-driven ranking of Golden Visa-eligible investment funds in Portugal. 
        Our comprehensive index evaluates funds based on performance, regulatory quality, fee structure, 
        and investor protections to help you make informed investment decisions.
      </p>
      
      <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Updated January 2025
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          {funds.length} Funds Analyzed
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Regulatory Verified
        </div>
      </div>
    </div>
  );
};

export default FundIndexHeader;
