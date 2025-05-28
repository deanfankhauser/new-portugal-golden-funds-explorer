
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../data/funds';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitCompare, User } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { useAuth } from '../contexts/AuthContext';
import PasswordDialog from './PasswordDialog';

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
              <Link to={`/funds/${fund.id}`} className="hover:text-portugal-blue transition-colors">
                {fund.name}
              </Link>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground mb-4">
            {fund.description}
          </div>

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

          {/* Fund Manager Section */}
          <div className="flex items-center gap-2 mb-4 bg-slate-50 p-2 rounded-md">
            <User className="w-4 h-4 text-[#EF4444]" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Fund Manager</p>
              <Link 
                to={`/manager/${encodeURIComponent(fund.managerName)}`}
                className="font-medium hover:text-[#EF4444] transition-colors"
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
