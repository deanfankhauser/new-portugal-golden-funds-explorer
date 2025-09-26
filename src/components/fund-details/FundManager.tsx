
import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";
import { User, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { managerToSlug } from '../../lib/utils';

interface FundManagerProps {
  managerName: Fund['managerName'];
}

const FundManager: React.FC<FundManagerProps> = ({ managerName }) => {
  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-5">
          <User className="w-5 h-5 mr-2 text-accent" />
          <h2 className="text-xl font-bold text-foreground">Fund Manager</h2>
        </div>
        <Link 
          to={`/manager/${managerToSlug(managerName)}`}
          className="flex items-center gap-4 bg-muted/50 p-5 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground">{managerName}</h3>
            <p className="text-sm text-muted-foreground">View all funds managed by {managerName}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-accent" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default FundManager;
