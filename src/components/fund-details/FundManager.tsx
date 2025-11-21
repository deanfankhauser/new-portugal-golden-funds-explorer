
import React from 'react';
import { Fund } from '../../data/types/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { managerToSlug } from '../../lib/utils';
import { CompanyLogo } from '../shared/CompanyLogo';

interface FundManagerProps {
  managerName: Fund['managerName'];
}

const FundManager: React.FC<FundManagerProps> = ({ managerName }) => {
  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Fund Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Link 
          to={`/manager/${managerToSlug(managerName)}`}
          className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 hover:border-accent/40 transition-all group"
        >
          <div className="flex items-center gap-3">
            <CompanyLogo managerName={managerName} size="md" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{managerName}</h3>
              <p className="text-sm text-muted-foreground">View all funds managed by this manager</p>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-accent group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default FundManager;
