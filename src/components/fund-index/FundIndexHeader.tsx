
import React from 'react';
import { TrendingUp, Award, BarChart3, Sparkles } from 'lucide-react';

const FundIndexHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl"></div>
      <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl"></div>
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full blur-xl"></div>
      
      <div className="relative bg-white/80 backdrop-blur-sm border-2 border-blue-100 rounded-3xl p-8 md:p-12 shadow-xl">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 
                          text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 
                          border border-blue-200 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>2025 Golden Visa Fund Rankings</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            <span className="block mb-2">Portugal Golden Visa</span>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 
                           bg-clip-text text-transparent">
              Fund Index
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed font-light max-w-3xl mx-auto">
            The definitive, <span className="font-semibold text-blue-700">data-driven ranking</span> of 
            Golden Visa-eligible investment funds in Portugal
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center justify-center gap-3 bg-white/60 backdrop-blur-sm 
                            px-6 py-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Performance Scored</div>
                <div className="text-sm text-gray-600">Data-driven metrics</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 bg-white/60 backdrop-blur-sm 
                            px-6 py-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Regulation Rated</div>
                <div className="text-sm text-gray-600">Compliance verified</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 bg-white/60 backdrop-blur-sm 
                            px-6 py-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
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
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">11+ Verified Funds</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">€500M+ Total AUM</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="font-medium">Updated Monthly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundIndexHeader;
