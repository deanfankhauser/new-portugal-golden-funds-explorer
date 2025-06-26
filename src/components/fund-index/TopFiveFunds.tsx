
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ExternalLink, Star } from 'lucide-react';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface TopFiveFundsProps {
  scores: FundScore[];
}

const TopFiveFunds: React.FC<TopFiveFundsProps> = ({ scores }) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top 5 Golden Visa Funds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scores.map((score, index) => {
          const fund = getFundById(score.fundId);
          if (!fund) return null;
          
          return (
            <div
              key={fund.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {fund.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {fund.managerName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Portugal
                    </Badge>
                    {index === 0 && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        #1 Ranked
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <div className="text-2xl font-bold text-blue-600">
                  {score.movingtoScore}
                </div>
                <div className="text-xs text-gray-500">
                  Movingto Score
                </div>
                <Link to={`/funds/${fund.id}`}>
                  <Button size="sm" variant="outline" className="text-xs">
                    View Details
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
        
        <div className="pt-4 border-t">
          <Link to="#full-index">
            <Button variant="outline" className="w-full">
              View Complete Index
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopFiveFunds;
