
import React, { useState } from 'react';
import { FileText, Lock, Eye } from 'lucide-react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '../../contexts/AuthContext';
import { ContentGatingService } from '../../services/contentGatingService';
import LazyPasswordDialog from '../common/LazyPasswordDialog';

interface FeeStructureProps {
  fund: Fund;
  formatPercentage: (value: number) => string;
}

const FeeStructure: React.FC<FeeStructureProps> = ({ fund, formatPercentage }) => {
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const handleUnlockClick = () => {
    setShowPasswordDialog(true);
  };

  // Show gated content for non-authenticated users
  if (!isAuthenticated) {
    return (
      <>
        <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Fee Structure</h2>
              </div>
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            
            {/* Blurred preview */}
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 filter blur-sm">
                <div className="bg-muted p-4 rounded-lg border border-border">
                  <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Management Fee</h3>
                  <p className="text-2xl font-bold text-primary mt-1">•.••%</p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg border border-border">
                  <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Performance Fee</h3>
                  <p className="text-2xl font-bold text-primary mt-1">••.•%</p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg border border-border">
                  <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Subscription Fee</h3>
                  <p className="text-2xl font-bold text-primary mt-1">•.••%</p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg border border-border">
                  <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Total Expense Ratio</h3>
                  <p className="text-2xl font-bold text-primary mt-1">•.••%</p>
                </div>
              </div>
              
              {/* Overlay with unlock button */}
              <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Detailed Fee Analysis</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                    Get complete fee breakdown including hidden costs and total expense ratios
                  </p>
                  <Button 
                    onClick={handleUnlockClick}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Fee Analysis
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Public teaser info */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                💡 <strong>What you'll get:</strong> Complete fee breakdown, total cost analysis, 
                fee comparison with similar funds, and hidden cost identification.
              </p>
            </div>
          </CardContent>
        </Card>

        <LazyPasswordDialog 
          open={showPasswordDialog}
          onOpenChange={setShowPasswordDialog}
        />
      </>
    );
  }

  // Show full content for authenticated users
  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-5">
          <FileText className="w-5 h-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Fee Structure</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-muted p-4 rounded-lg border border-border">
            <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Management Fee</h3>
            <p className="text-2xl font-bold text-primary mt-1">{formatPercentage(fund.managementFee)}</p>
          </div>
          
          <div className="bg-muted p-4 rounded-lg border border-border">
            <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Performance Fee</h3>
            <p className="text-2xl font-bold text-primary mt-1">{formatPercentage(fund.performanceFee)}</p>
          </div>
          
          {fund.subscriptionFee !== undefined && (
            <div className="bg-muted p-4 rounded-lg border border-border">
              <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Subscription Fee</h3>
              <p className="text-2xl font-bold text-primary mt-1">{formatPercentage(fund.subscriptionFee)}</p>
            </div>
          )}
          
          {fund.redemptionFee !== undefined && (
            <div className="bg-muted p-4 rounded-lg border border-border">
              <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Redemption Fee</h3>
              <p className="text-2xl font-bold text-primary mt-1">{formatPercentage(fund.redemptionFee)}</p>
            </div>
          )}
        </div>
        
        {/* Additional authenticated content */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="bg-success/10 p-4 rounded-lg border border-success/30">
            <h4 className="font-semibold text-success text-sm mb-2">✅ MovingTo Analysis</h4>
            <p className="text-sm text-success-foreground">
              Total estimated annual cost: <strong>{formatPercentage(fund.managementFee + fund.performanceFee)}</strong> 
              {fund.subscriptionFee && ` + ${formatPercentage(fund.subscriptionFee)} entry fee`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeStructure;
