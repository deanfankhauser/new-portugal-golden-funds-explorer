
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../data/funds';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitCompare, User, Lock, Euro } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { useAuth } from '../contexts/AuthContext';
import { ContentGatingService } from '../services/contentGatingService';
import PasswordDialog from './PasswordDialog';
import { managerToSlug } from '../lib/utils';

interface FundCardProps {
  fund: Fund;
}

const FundCard: React.FC<FundCardProps> = ({ fund }) => {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  const isSelected = isInComparison(fund.id);
  
  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking on the button
    
    if (!isAuthenticated) {
      setShowPasswordDialog(true);
      return;
    }
    
    if (isSelected) {
      removeFromComparison(fund.id);
    } else {
      addToComparison(fund);
    }
  };

  const handleUnlockClick = () => {
    setShowPasswordDialog(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">
              <Link to={`/${fund.id}`} className="hover:text-portugal-blue transition-colors">
                {fund.name}
              </Link>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground mb-4">
            {fund.description}
          </div>

          {/* Public Information - Always Visible */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Min Investment</p>
              <p className="font-medium">{formatCurrency(fund.minimumInvestment)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Target Return</p>
              <p className="font-medium">{fund.returnTarget}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fund Size</p>
              <p className="font-medium">{fund.fundSize}M EUR</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Term</p>
              <p className="font-medium">{fund.term} years</p>
            </div>
          </div>

          {/* Gated Fee Information */}
          <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Euro className="w-3 h-3 text-blue-500" />
                <p className="text-sm text-muted-foreground">Mgmt Fee</p>
              </div>
              {isAuthenticated ? (
                <p className="font-medium">{fund.managementFee}%</p>
              ) : (
                <div 
                  className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
                  onClick={handleUnlockClick}
                  title={ContentGatingService.getGatedMessage('fees')}
                >
                  <Lock className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">Gated</span>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Euro className="w-3 h-3 text-green-500" />
                <p className="text-sm text-muted-foreground">Perf Fee</p>
              </div>
              {isAuthenticated ? (
                <p className="font-medium">{fund.performanceFee}%</p>
              ) : (
                <div 
                  className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
                  onClick={handleUnlockClick}
                  title={ContentGatingService.getGatedMessage('fees')}
                >
                  <Lock className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">Gated</span>
                </div>
              )}
            </div>
          </div>

          {/* Fund Manager Section */}
          <div className="flex items-center gap-2 mb-4 bg-slate-50 p-2 rounded-md">
            <User className="w-4 h-4 text-[#EF4444]" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Fund Manager</p>
              <Link 
                to={`/manager/${managerToSlug(fund.managerName)}`}
                className="font-medium hover:text-[#EF4444] transition-colors"
              >
                {fund.managerName}
              </Link>
            </div>
          </div>

          {/* Gated Content Notice for Non-Authenticated Users */}
          {!isAuthenticated && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Premium Data Available</span>
              </div>
              <p className="text-xs text-blue-700 mb-2">
                Access detailed fee analysis and comparison tools
              </p>
              <Button 
                size="sm" 
                onClick={handleUnlockClick}
                className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1"
              >
                Unlock Premium Data
              </Button>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              size="sm"
              className={`${
                isSelected 
                  ? 'bg-[#EF4444] text-white' 
                  : 'border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white'
              }`}
              onClick={handleCompareClick}
            >
              <GitCompare className="mr-1 h-3 w-3" />
              {isSelected ? 'Added to Compare' : 'Compare'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <PasswordDialog 
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </>
  );
};

export default FundCard;
