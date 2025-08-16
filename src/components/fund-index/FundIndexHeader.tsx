
import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

const FundIndexHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          {/* Enhanced badge with better styling */}
          <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-blue-100 shadow-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            2025 Fund Rankings
          </div>

          {/* Improved title with better typography */}
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 leading-tight tracking-tight">
            Portugal Golden Visa Investment
            <span className="block text-blue-600 mt-2">Fund Index</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-gray-600 mb-16 leading-relaxed max-w-3xl mx-auto font-light">
            Comprehensive Analysis of Portugal Golden Visa Investment Funds
          </h2>

          {/* Enhanced metrics with better visual design */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="group">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-blue-200">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-gray-900 mb-1">11+</div>
                    <div className="text-sm font-medium text-gray-600">Verified Funds</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Comprehensive analysis & verification
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-green-200">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl group-hover:from-green-100 group-hover:to-emerald-100 transition-colors">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-gray-900 mb-1">€500M+</div>
                    <div className="text-sm font-medium text-gray-600">Total AUM</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Combined assets under management
                </div>
              </div>
            </div>
          </div>

          {/* Added trust indicators */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Updated Monthly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Regulatory Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Independent Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundIndexHeader;
