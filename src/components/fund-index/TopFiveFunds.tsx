
import React from 'react';
import { Link } from 'react-router-dom';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Trophy, TrendingUp, ExternalLink, Crown, Medal, Award } from 'lucide-react';

interface TopFiveFundsProps {
  scores: FundScore[];
}

const TopFiveFunds: React.FC<TopFiveFundsProps> = ({ scores }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-amber-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <Trophy className="w-4 h-4 text-blue-500" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0';
      case 2: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0';
      case 3: return 'bg-gradient-to-r from-amber-600 to-orange-500 text-white border-0';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getCardBorder = (rank: number) => {
    switch (rank) {
      case 1: return 'border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50';
      case 2: return 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50';
      case 3: return 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50';
      default: return 'border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50';
    }
  };

  return (
    <Card id="top-five" className="border-2 border-blue-100 shadow-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-white/20 rounded-lg">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <div>Top 5 Golden Visa Funds</div>
            <div className="text-blue-100 text-sm font-normal mt-1">
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
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 
                           hover:shadow-lg hover:-translate-y-1 ${getCardBorder(score.rank)}`}
              >
                {/* Rank indicator */}
                <div className="absolute -top-3 -left-3">
                  <Badge className={`text-lg font-bold px-3 py-2 shadow-lg ${getRankBadgeColor(score.rank)}`}>
                    #{score.rank}
                  </Badge>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      {getRankIcon(score.rank)}
                      <h3 className="text-xl font-bold text-gray-900 truncate">
                        {fund.name}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {score.movingtoScore}
                        </div>
                        <div className="text-xs text-gray-500">Movingto Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-emerald-600">
                          {score.performanceScore}
                        </div>
                        <div className="text-xs text-gray-500">Performance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                          {fund.managementFee}%
                        </div>
                        <div className="text-xs text-gray-500">Mgmt Fee</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-600">
                          €{(fund.minimumInvestment / 1000).toFixed(0)}k
                        </div>
                        <div className="text-xs text-gray-500">Min Investment</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {fund.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {fund.returnTarget}
                      </Badge>
                      <Badge 
                        variant={fund.fundStatus === 'Open' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {fund.fundStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:min-w-[140px]">
                    <Link to={`/funds/${fund.id}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 
                                       hover:from-blue-700 hover:to-indigo-700 text-white shadow-md
                                       transition-all duration-300 hover:shadow-lg">
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
                    <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 
                                   px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                      <TrendingUp className="w-3 h-3" />
                      Top Rated
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            <strong>Rankings updated monthly</strong> based on performance, regulation compliance, 
            fees, and investor protection metrics.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopFiveFunds;
