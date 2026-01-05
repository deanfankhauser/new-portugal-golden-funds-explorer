import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ManagersHubHeaderProps {
  managerCount?: number;
}

const ManagersHubHeader: React.FC<ManagersHubHeaderProps> = ({ managerCount }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground" itemProp="name">
          Fund Managers
        </h1>
        {managerCount !== undefined && managerCount > 0 && (
          <Badge variant="secondary" className="text-sm tabular-nums">
            {managerCount}
          </Badge>
        )}
      </div>
      
      <p className="text-muted-foreground max-w-2xl" itemProp="description">
        Explore fund managers offering Portugal Golden Visa eligible investment funds. 
        Compare strategies, track records, and connect directly.
      </p>
    </div>
  );
};

export default ManagersHubHeader;
