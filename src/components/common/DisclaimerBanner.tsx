import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const DisclaimerBanner = () => {
  return (
    <div className="bg-muted/50 border-b border-border py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4" />
          <span>
            This website provides information for general purposes only. 
            <Link 
              to="/disclaimer" 
              className="text-primary hover:underline ml-1 font-medium"
            >
              Read our full disclaimer
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;