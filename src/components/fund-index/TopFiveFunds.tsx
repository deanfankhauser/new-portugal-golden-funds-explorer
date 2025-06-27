
import React from 'react';
import { Link } from 'react-router-dom';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';

interface TopFiveFundsProps {
  scores: FundScore[];
}

const TopFiveFunds: React.FC<TopFiveFundsProps> = ({ scores }) => {
  return (
    <Card id="top-five" className="border border-gray-200 bg-white">
      <CardHeader className="border-b border-gray-200 bg-white">
        <CardTitle className="text-xl font-semibold text-gray-900">
          Top 5 Funds
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Ranked by comprehensive scoring methodology
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200">
          {scores.map((score, index) => {
            const fund = getFundById(score.fundId);
            if (!fund) return null;

            return (
              <div key={score.fundId} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 text-sm font-medium rounded-full flex-shrink-0">
                      {score.rank}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate mb-1">
                        {fund.name}
                      </h3>
                      
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="text-xl font-semibold text-gray-900">
                            {score.movingtoScore}
                          </div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                        <div>
                          <div className="text-lg font-medium text-gray-700">
                            {fund.managementFee}%
                          </div>
                          <div className="text-xs text-gray-500">Mgmt Fee</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Link to={`/funds/${fund.id}`}>
                      <Button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Rankings updated monthly based on performance, regulation compliance, and fee analysis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopFiveFunds;
