
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, TrendingUp, Euro, Users } from 'lucide-react';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface FundIndexMobileCardProps {
  score: FundScore;
}

const FundIndexMobileCard: React.FC<FundIndexMobileCardProps> = ({ score }) => {
  const fund = getFundById(score.fundId);
  
  if (!fund) return null;

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-blue-600">#{score.rank}</span>
              {score.rank <= 3 && (
                <Badge variant="secondary" className="text-xs">
                  Top {score.rank}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg leading-tight">{fund.name}</h3>
            <p className="text-sm text-gray-600">{fund.managerName}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{score.movingtoScore}</div>
            <div className="text-xs text-gray-500">Movingto Score</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <div>
              <div className="text-sm font-semibold">{score.performanceScore}/100</div>
              <div className="text-xs text-gray-500">Performance</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4 text-blue-500" />
            <div>
              <div className="text-sm font-semibold">{fund.managementFee}%</div>
              <div className="text-xs text-gray-500">Mgmt Fee</div>
            </div>
          </div>
        </div>

        {/* Investment Details */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Min Investment:</span>
            <span className="text-sm font-semibold">€{fund.minimumInvestment.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Category:</span>
            <Badge variant="outline" className="text-xs">{fund.category}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status:</span>
            <Badge 
              variant={fund.fundStatus === 'Open' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {fund.fundStatus}
            </Badge>
          </div>
        </div>

        {/* Action Button */}
        <Link to={`/funds/${fund.id}`} className="block">
          <Button variant="outline" className="w-full">
            View Details
            <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default FundIndexMobileCard;
