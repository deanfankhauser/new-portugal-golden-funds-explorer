
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../data/funds';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitCompare, User, Euro, CheckCircle2 } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { managerToSlug } from '../lib/utils';
import { getReturnTargetDisplay } from '../utils/returnTarget';
import RecentlyVerifiedBadge from './common/RecentlyVerifiedBadge';

interface FundCardProps {
  fund: Fund;
}

const FundCard: React.FC<FundCardProps> = ({ fund }) => {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  
  const isSelected = isInComparison(fund.id);
  
  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking on the button
    
    if (isSelected) {
      removeFromComparison(fund.id);
    } else {
      addToComparison(fund);
    }
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
      <Card className={`h-full hover:shadow-lg transition-shadow ${
        fund.isVerified 
          ? 'ring-2 ring-success/30 border-success/30' 
          : ''
      }`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl">
                <Link to={`/${fund.id}`} className="hover:text-accent transition-colors block" onClick={() => window.scrollTo(0, 0)}>
                  {fund.name}
                </Link>
              </CardTitle>
              {fund.isVerified ? (
                <div className="mt-2 flex items-center gap-2">
                  <div className="bg-success text-success-foreground px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md border-2 border-success/70 ring-2 ring-success/20 w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ VERIFIED</span>
                  </div>
                  <RecentlyVerifiedBadge verifiedAt={fund.verifiedAt} />
                </div>
              ) : (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">UNVERIFIED</Badge>
                </div>
              )}
            </div>
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
              <p className="text-sm text-muted-foreground">Target Annual Return</p>
              <p className="font-medium">{getReturnTargetDisplay(fund)}</p>
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

          {/* Fee Information */}
          <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-accent/5 border border-accent/20 rounded-lg">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Euro className="w-3 h-3 text-accent" />
                <p className="text-sm text-muted-foreground">Mgmt Fee</p>
              </div>
              <p className="font-medium">{fund.managementFee}%</p>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Euro className="w-3 h-3 text-accent" />
                <p className="text-sm text-muted-foreground">Perf Fee</p>
              </div>
              <p className="font-medium">{fund.performanceFee}%</p>
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
    </>
  );
};

export default FundCard;
