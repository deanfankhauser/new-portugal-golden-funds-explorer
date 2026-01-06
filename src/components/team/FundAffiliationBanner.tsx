import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface FundAffiliationBannerProps {
  fundName: string;
  fundSlug: string;
}

export const FundAffiliationBanner: React.FC<FundAffiliationBannerProps> = ({
  fundName,
  fundSlug
}) => {
  return (
    <div className="w-full bg-muted/30 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3 text-sm">
          <Badge variant="outline" className="gap-1.5 font-medium">
            <Users className="h-3 w-3" />
            Fund Team
          </Badge>
          <span className="text-muted-foreground">
            Team member at{' '}
            <Link 
              to={`/funds/${fundSlug}`}
              className="text-primary hover:underline font-medium"
            >
              {fundName}
            </Link>
            {' '}(listed on Movingto Funds)
          </span>
        </div>
      </div>
    </div>
  );
};
