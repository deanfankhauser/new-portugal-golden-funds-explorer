
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
import LazyPasswordDialog from './common/LazyPasswordDialog';
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
              <Link to={`/${fund.id}`} className="hover:text-accent transition-colors">
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
              <p className="font-medium">{fund.minimumInvestment > 0 ? formatCurrency(fund.minimumInvestment) : 'Not provided'}</p>
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
          <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-accent/5 border border-accent/20 rounded-lg">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Euro className="w-3 h-3 text-accent" />
                <p className="text-sm text-muted-foreground">Mgmt Fee</p>
              </div>
              {isAuthenticated ? (
                <p className="font-medium">{fund.managementFee}%</p>
              ) : (
                <div 
                  className="flex items-center cursor-pointer hover:bg-secondary rounded px-2 py-1"
                  onClick={handleUnlockClick}
                  title={ContentGatingService.getGatedMessage('fees')}
                >
                  <Lock className="h-3 w-3 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">Gated</span>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Euro className="w-3 h-3 text-accent" />
                <p className="text-sm text-muted-foreground">Perf Fee</p>
              </div>
              {isAuthenticated ? (
                <p className="font-medium">{fund.performanceFee}%</p>
              ) : (
                <div 
                  className="flex items-center cursor-pointer hover:bg-secondary rounded px-2 py-1"
                  onClick={handleUnlockClick}
                  title={ContentGatingService.getGatedMessage('fees')}
                >
                  <Lock className="h-3 w-3 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">Gated</span>
                </div>
              )}
            </div>
          </div>

          {/* Fund Manager Section */}
          <div className="flex items-center gap-2 mb-4 bg-secondary p-2 rounded-md">
            <User className="w-4 h-4 text-accent" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Fund Manager</p>
              <Link 
                to={`/manager/${managerToSlug(fund.managerName)}`}
                className="font-medium hover:text-accent transition-colors"
              >
                {fund.managerName}
              </Link>
            </div>
          </div>

          {/* Gated Content Notice for Non-Authenticated Users */}
          {!isAuthenticated && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Premium Data Available</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Access detailed fee analysis and comparison tools
              </p>
              <Button 
                size="sm" 
                onClick={handleUnlockClick}
                className="text-xs px-3 py-1"
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
                  ? 'bg-primary text-primary-foreground' 
                  : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
              onClick={handleCompareClick}
            >
              <GitCompare className="mr-1 h-3 w-3" />
              {isSelected ? 'Added to Compare' : 'Compare'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <LazyPasswordDialog 
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </>
  );
};

export default FundCard;
