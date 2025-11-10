import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fund } from '@/data/types/funds';

interface FundManagementHeaderProps {
  fund: Fund;
  canDirectEdit: boolean;
}

const FundManagementHeader: React.FC<FundManagementHeaderProps> = ({ fund, canDirectEdit }) => {
  return (
    <div className="border-b bg-card">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-2"
              >
                <Link to="/my-funds">
                  <ArrowLeft className="h-4 w-4" />
                  Back to My Funds
                </Link>
              </Button>
            </div>
            
            <div className="flex items-start gap-3">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {fund.name}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {fund.category}
                  </Badge>
                  {fund.isVerified && (
                    <Badge variant="default" className="text-xs gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  {canDirectEdit ? (
                    <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                      Direct Edit Access
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Suggest Edits Only
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link to={`/${fund.id}`} target="_blank" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View Public Page
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundManagementHeader;
