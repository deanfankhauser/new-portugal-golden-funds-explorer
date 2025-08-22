
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, TrendingUp } from 'lucide-react';

const FundIndexBreadcrumbs: React.FC = () => {
  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav aria-label="breadcrumbs">
          <ol className="flex items-center text-sm space-x-1">
            <li className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-primary/10"
              >
                <Home className="h-4 w-4" />
                <span className="font-medium">Home</span>
              </Link>
            </li>
            <li className="flex items-center text-muted-foreground">
              <ChevronRight className="h-4 w-4 mx-1" />
            </li>
            <li className="flex items-center">
              <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-md">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">Fund Index</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default FundIndexBreadcrumbs;
