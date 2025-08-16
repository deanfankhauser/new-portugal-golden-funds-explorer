import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, Database, Award, ArrowRight } from 'lucide-react';

export const FundIndexWidget: React.FC = () => {
  return (
    <Link 
      to="/index" 
      className="group block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:border-blue-200 transition-all duration-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-md group-hover:bg-blue-200 transition-colors">
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <span className="font-semibold text-gray-900">Fund Index</span>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Complete Portugal Golden Visa fund rankings
      </p>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Database className="h-3 w-3" />
          <span>25+ Funds</span>
        </div>
        <div className="flex items-center gap-1">
          <Award className="h-3 w-3" />
          <span>Verified</span>
        </div>
      </div>
    </Link>
  );
};

export const ComparisonWidget: React.FC = () => {
  return (
    <Link 
      to="/compare" 
      className="group block p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-100 hover:border-orange-200 transition-all duration-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-100 rounded-md group-hover:bg-orange-200 transition-colors">
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </div>
          <span className="font-semibold text-gray-900">Compare Funds</span>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
      </div>
      <p className="text-sm text-gray-600">
        Side-by-side fund analysis
      </p>
    </Link>
  );
};