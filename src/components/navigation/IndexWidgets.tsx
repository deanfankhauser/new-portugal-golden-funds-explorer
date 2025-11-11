import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, Database, Award, ArrowRight } from 'lucide-react';

export const FundIndexWidget: React.FC = () => {
  return (
    <Link 
      to="/" 
      className="group block p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 hover:border-primary/30 transition-all duration-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-gray-900">Fund Index</span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
      className="group block p-4 bg-gradient-to-br from-accent/5 to-warning/5 rounded-lg border border-accent/20 hover:border-accent/30 transition-all duration-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-accent/10 rounded-md group-hover:bg-accent/20 transition-colors">
            <BarChart3 className="h-4 w-4 text-accent" />
          </div>
          <span className="font-semibold text-gray-900">Compare Funds</span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
      </div>
      <p className="text-sm text-gray-600">
        Side-by-side fund analysis
      </p>
    </Link>
  );
};