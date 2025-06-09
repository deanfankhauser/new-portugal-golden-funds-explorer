
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../data/funds';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GitCompare, PieChart, Globe, Tag, User } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { useAuth } from '../contexts/AuthContext';
import IntroductionButton from './fund-details/IntroductionButton';
import PasswordDialog from './PasswordDialog';
import { formatPercentage } from './fund-details/utils/formatters';
import { tagToSlug, categoryToSlug, managerToSlug } from '@/lib/utils';
import OptimizedImage from './common/OptimizedImage';
import { ImageOptimizationService } from '../services/imageOptimizationService';

interface FundListItemProps {
  fund: Fund;
}

const FundListItem: React.FC<FundListItemProps> = ({ fund }) => {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  const isSelected = isInComparison(fund.id);
  
  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to fund details
    
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

  // Get the main geographic allocation (first one)
  const mainGeoAllocation = fund.geographicAllocation && fund.geographicAllocation.length > 0 
    ? fund.geographicAllocation[0] 
    : null;

  // Generate fund logo placeholder or use actual logo if available
  const fundLogoSrc = fund.logo || `https://images.unsplash.com/photo-1518770660439-4636190af475?w=240&h=160&fit=crop&auto=format`;
  const fundLogoAlt = ImageOptimizationService.generateFundLogoAlt(fund.name, fund.managerName);

  return (
    <>
      <Card className="border rounded-lg hover:border-gray-300 transition-colors bg-white shadow-sm" role="article" aria-labelledby={`fund-list-${fund.id}-title`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 md:w-48">
              <OptimizedImage
                src={fundLogoSrc}
                alt={fundLogoAlt}
                width={240}
                height={160}
                className="w-full h-32 object-cover rounded-lg border border-gray-100"
                lazy={true}
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold" id={`fund-list-${fund.id}-title`}>
                  <Link to={`/funds/${fund.id}`} className="hover:text-[#EF4444] transition-colors">
                    {fund.name}
                  </Link>
                </h3>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{fund.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4" role="group" aria-label="Fund key information">
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-[#EF4444]" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">
                      <Link 
                        to={`/categories/${categoryToSlug(fund.category)}`} 
                        className="hover:text-[#EF4444] transition-colors"
                        aria-label={`View ${fund.category} category funds`}
                      >
                        {fund.category}
                      </Link>
                    </p>
                  </div>
                </div>
                
                {mainGeoAllocation && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-[#EF4444]" aria-hidden="true" />
                    <div>
                      <p className="text-sm text-muted-foreground">Main Region</p>
                      <p className="font-medium" aria-label={`Main region ${mainGeoAllocation.region} with ${formatPercentage(mainGeoAllocation.percentage)} allocation`}>
                        {mainGeoAllocation.region} ({formatPercentage(mainGeoAllocation.percentage)})
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <PieChart className="w-4 h-4 mr-2 text-[#EF4444]" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-muted-foreground">Target Return</p>
                    <p className="font-medium" aria-label={`Target return ${fund.returnTarget}`}>
                      {fund.returnTarget}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-[#EF4444]" aria-hidden="true" />
                  <div>
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
              </div>
            </div>
            
            <div className="flex flex-col gap-3 justify-center min-w-[160px]" role="group" aria-label="Fund actions">
              <IntroductionButton variant="compact" />
              
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

export default FundListItem;
