
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
import { managerToSlug } from '../lib/utils';
import OptimizedImage from './common/OptimizedImage';
import { ImageOptimizationService } from '../services/imageOptimizationService';

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

  // Generate fund logo placeholder or use actual logo if available
  const fundLogoSrc = fund.logo || `https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=120&fit=crop&auto=format`;
  const fundLogoAlt = ImageOptimizationService.generateFundLogoAlt(fund.name, fund.managerName);

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-shadow" role="article" aria-labelledby={`fund-${fund.id}-title`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl" id={`fund-${fund.id}-title`}>
                <Link to={`/funds/${fund.id}`} className="hover:text-portugal-blue transition-colors">
                  {fund.name}
                </Link>
              </CardTitle>
            </div>
            <div className="flex-shrink-0">
              <OptimizedImage
                src={fundLogoSrc}
                alt={fundLogoAlt}
                width={60}
                height={40}
                className="rounded object-contain bg-white border border-gray-100 p-1"
                lazy={true}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground mb-4">
            {fund.description}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4" role="group" aria-label="Fund details">
            <div>
              <p className="text-sm text-muted-foreground">Min Investment</p>
              <p className="font-medium" aria-label={`Minimum investment ${formatCurrency(fund.minimumInvestment)}`}>
                {formatCurrency(fund.minimumInvestment)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Target Return</p>
              <p className="font-medium" aria-label={`Target return ${fund.returnTarget}`}>
                {fund.returnTarget}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fund Size</p>
              <p className="font-medium" aria-label={`Fund size ${fund.fundSize} million euros`}>
                {fund.fundSize}M EUR
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Term</p>
              <p className="font-medium" aria-label={`Investment term ${fund.term} years`}>
                {fund.term} years
              </p>
            </div>
          </div>

          {/* Fund Manager Section */}
          <div className="flex items-center gap-2 mb-4 bg-slate-50 p-2 rounded-md" role="group" aria-label="Fund manager information">
            <User className="w-4 h-4 text-[#EF4444]" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Fund Manager</p>
              <Link 
                to={`/manager/${managerToSlug(fund.managerName)}`}
                className="font-medium hover:text-[#EF4444] transition-colors"
                aria-label={`View ${fund.managerName} manager details`}
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
              aria-label={isSelected ? `Remove ${fund.name} from comparison` : `Add ${fund.name} to comparison`}
              aria-pressed={isSelected}
            >
              <GitCompare className="mr-1 h-3 w-3" aria-hidden="true" />
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
