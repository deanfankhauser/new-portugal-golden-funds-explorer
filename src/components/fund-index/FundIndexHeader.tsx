
import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

const FundIndexHeader: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          {/* Simple badge */}
          <div className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium mb-8">
            2025 Fund Rankings
          </div>

          {/* Clean title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Portugal Golden Visa Fund Index
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            Data-driven rankings of Golden Visa-eligible investment funds in Portugal
          </p>

          {/* Simplified metrics - only 2 key ones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-3 p-6">
              <div className="p-3 bg-gray-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">11+</div>
                <div className="text-sm text-gray-600">Verified Funds</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 p-6">
              <div className="p-3 bg-gray-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">€500M+</div>
                <div className="text-sm text-gray-600">Total AUM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundIndexHeader;
