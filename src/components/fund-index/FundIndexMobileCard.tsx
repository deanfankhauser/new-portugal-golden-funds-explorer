
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, TrendingUp, Euro, Users, Lock, Eye } from 'lucide-react';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import PasswordDialog from '../PasswordDialog';

interface FundIndexMobileCardProps {
  score: FundScore;
}

const FundIndexMobileCard: React.FC<FundIndexMobileCardProps> = ({ score }) => {
  const fund = getFundById(score.fundId);
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  if (!fund) return null;

  const handleUnlockClick = () => {
    setShowPasswordDialog(true);
  };

  return (
    <>
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
              {isAuthenticated ? (
                <>
                  <div className="text-2xl font-bold text-blue-600">{score.movingtoScore}</div>
                  <div className="text-xs text-gray-500">Movingto Score</div>
                </>
              ) : (
                <div 
                  className="flex flex-col items-center cursor-pointer hover:bg-blue-50 rounded p-2"
                  onClick={handleUnlockClick}
                >
                  <Lock className="h-6 w-6 text-gray-400 mb-1" />
                  <div className="text-xs text-gray-500">Score Gated</div>
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                {isAuthenticated ? (
                  <>
                    <div className="text-sm font-semibold">{score.performanceScore}/100</div>
                    <div className="text-xs text-gray-500">Performance</div>
                  </>
                ) : (
                  <div 
                    className="flex items-center cursor-pointer hover:bg-gray-50 rounded p-1"
                    onClick={handleUnlockClick}
                  >
                    <Lock className="h-3 w-3 text-gray-400 mr-1" />
                    <div className="text-xs text-gray-500">Gated</div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-blue-500" />
              <div>
                {isAuthenticated ? (
                  <>
                    <div className="text-sm font-semibold">{fund.managementFee}%</div>
                    <div className="text-xs text-gray-500">Mgmt Fee</div>
                  </>
                ) : (
                  <div 
                    className="flex items-center cursor-pointer hover:bg-gray-50 rounded p-1"
                    onClick={handleUnlockClick}
                  >
                    <Lock className="h-3 w-3 text-gray-400 mr-1" />
                    <div className="text-xs text-gray-500">Gated</div>
                  </div>
                )}
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

          {/* Gated Content Notice for Non-Authenticated Users */}
          {!isAuthenticated && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Premium Data Available</span>
              </div>
              <p className="text-xs text-blue-700 mb-3">
                Access detailed performance metrics, fee analysis, and fund scores
              </p>
              <Button 
                size="sm" 
                onClick={handleUnlockClick}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="h-3 w-3 mr-2" />
                View Premium Data
              </Button>
            </div>
          )}

          {/* Action Button */}
          <Link to={`/${fund.id}`} className="block">
            <Button variant="outline" className="w-full">
              View Details
              <ExternalLink className="h-3 w-3 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <PasswordDialog 
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </>
  );
};

export default FundIndexMobileCard;
