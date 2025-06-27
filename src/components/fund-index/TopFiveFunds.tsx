
import React from 'react';
import { Link } from 'react-router-dom';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Trophy, ExternalLink, Crown, Medal, Award } from 'lucide-react';

interface TopFiveFundsProps {
  scores: FundScore[];
}

const TopFiveFunds: React.FC<TopFiveFundsProps> = ({ scores }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-amber-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <Trophy className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-amber-100 text-amber-800 border-amber-200';
      case 2: return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCardStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'border-amber-200 bg-amber-50/30';
      case 2: return 'border-gray-200 bg-gray-50/30';
      case 3: return 'border-orange-200 bg-orange-50/30';
      default: return 'border-gray-200 bg-white';
    }
  };

  return (
    <Card id="top-five" className="border border-gray-200 shadow-sm bg-white">
      <CardHeader className="bg-gray-900 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-white/10 rounded-lg">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <div>Top 5 Golden Visa Funds</div>
            <div className="text-gray-300 text-sm font-normal mt-1">
              Ranked by Movingto Score • 2025 Edition
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {scores.map((score) => {
            const fund = getFundById(score.fundId);
            if (!fund) return null;

            return (
              <div
                key={score.fundId}
                className={`relative p-6 rounded-lg border transition-all duration-200 
                           hover:shadow-md ${getCardStyle(score.rank)}`}
              >
                {/* Rank indicator */}
                <div className="absolute -top-2 -left-2">
                  <Badge className={`text-sm font-semibold px-2 py-1 shadow-sm ${getRankBadgeColor(score.rank)}`}>
                    #{score.rank}
                  </Badge>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      {getRankIcon(score.rank)}
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {fund.name}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">
                          {score.movingtoScore}
                        </div>
                        <div className="text-xs text-gray-500">Movingto Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-700">
                          {score.performanceScore}
                        </div>
                        <div className="text-xs text-gray-500">Performance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-700">
                          {fund.managementFee}%
                        </div>
                        <div className="text-xs text-gray-500">Mgmt Fee</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-700">
                          €{(fund.minimumInvestment / 1000).toFixed(0)}k
                        </div>
                        <div className="text-xs text-gray-500">Min Investment</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                        {fund.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                        {fund.returnTarget}
                      </Badge>
                      <Badge 
                        variant={fund.fundStatus === 'Open' ? 'default' : 'secondary'}
                        className="text-xs bg-gray-100 text-gray-800"
                      >
                        {fund.fundStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:min-w-[120px]">
                    <Link to={`/funds/${fund.id}`}>
                      <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white shadow-sm
                                       transition-all duration-200">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Managed by</div>
                      <div className="text-sm font-medium text-gray-700 truncate">
                        {fund.managerName}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special indicator for #1 */}
                {score.rank === 1 && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium">
                      Top Rated
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 text-center">
            <strong>Rankings updated monthly</strong> based on performance, regulation compliance, 
            fees, and investor protection metrics.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopFiveFunds;
