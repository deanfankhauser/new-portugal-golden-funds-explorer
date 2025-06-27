
import React from 'react';
import { TrendingUp, Award, BarChart3, Sparkles } from 'lucide-react';

const FundIndexHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white rounded-2xl"></div>
      
      <div className="relative bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-sm">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>2025 Golden Visa Fund Rankings</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            <span className="block mb-2">Portugal Golden Visa</span>
            <span className="text-gray-800">Fund Index</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed font-light max-w-3xl mx-auto">
            The definitive, <span className="font-semibold text-gray-900">data-driven ranking</span> of 
            Golden Visa-eligible investment funds in Portugal
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center justify-center gap-3 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <TrendingUp className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Performance Scored</div>
                <div className="text-sm text-gray-600">Data-driven metrics</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Award className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Regulation Rated</div>
                <div className="text-sm text-gray-600">Compliance verified</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <BarChart3 className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Fee Analyzed</div>
                <div className="text-sm text-gray-600">Total cost clarity</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="font-medium">11+ Verified Funds</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="font-medium">€500M+ Total AUM</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="font-medium">Updated Monthly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundIndexHeader;
