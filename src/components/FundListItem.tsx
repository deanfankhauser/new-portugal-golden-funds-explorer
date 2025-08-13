
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../data/funds';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GitCompare, PieChart, Globe, Tag, User, Lock, Euro } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { useAuth } from '../contexts/AuthContext';
import { ContentGatingService } from '../services/contentGatingService';
import IntroductionButton from './fund-details/IntroductionButton';
import LazyPasswordDialog from './common/LazyPasswordDialog';
import { formatPercentage } from './fund-details/utils/formatters';
import { tagToSlug, categoryToSlug, managerToSlug } from '@/lib/utils';

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

  const handleUnlockClick = () => {
    setShowPasswordDialog(true);
  };

  // Get the main geographic allocation (first one)
  const mainGeoAllocation = fund.geographicAllocation && fund.geographicAllocation.length > 0 
    ? fund.geographicAllocation[0] 
    : null;

  return (
    <>
      <Card className="border rounded-lg hover:border-gray-300 transition-colors bg-white shadow-sm w-full">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                  <Link to={`/${fund.id}`} className="hover:text-[#EF4444] transition-colors block">
                    {fund.name}
                  </Link>
                </h3>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">{fund.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                <div className="flex items-center min-w-0">
                  <Tag className="w-4 h-4 mr-2 text-[#EF4444] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Category</p>
                    <p className="font-medium text-sm sm:text-base truncate">
                      <Link to={`/categories/${categoryToSlug(fund.category)}`} className="hover:text-[#EF4444] transition-colors">
                        {fund.category}
                      </Link>
                    </p>
                  </div>
                </div>
                
                {mainGeoAllocation && (
                  <div className="flex items-center min-w-0">
                    <Globe className="w-4 h-4 mr-2 text-[#EF4444] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">Main Region</p>
                      <p className="font-medium text-sm sm:text-base truncate">
                        {mainGeoAllocation.region} ({formatPercentage(mainGeoAllocation.percentage)})
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center min-w-0">
                  <PieChart className="w-4 h-4 mr-2 text-[#EF4444] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Target Return</p>
                    <p className="font-medium text-sm sm:text-base truncate">{fund.returnTarget}</p>
                  </div>
                </div>
                
                <div className="flex items-center min-w-0">
                  <User className="w-4 h-4 mr-2 text-[#EF4444] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Fund Manager</p>
                    <Link 
                      to={`/manager/${managerToSlug(fund.managerName)}`} 
                      className="font-medium hover:text-[#EF4444] transition-colors text-sm sm:text-base block truncate"
                      title={fund.managerName}
                    >
                      {fund.managerName}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Gated Financial Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Euro className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="text-sm text-gray-600">Mgmt Fee:</span>
                  </div>
                  {isAuthenticated ? (
                    <span className="font-medium text-sm">{fund.managementFee}%</span>
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
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Euro className="w-4 h-4 mr-2 text-green-500" />
                    <span className="text-sm text-gray-600">Perf Fee:</span>
                  </div>
                  {isAuthenticated ? (
                    <span className="font-medium text-sm">{fund.performanceFee}%</span>
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

              {/* Non-authenticated users see gated content notice */}
              {!isAuthenticated && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Premium Data Available</span>
                  </div>
                  <p className="text-xs text-blue-700 mb-2">
                    Access detailed fee analysis, performance metrics, and comparison tools
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
            </div>
            
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 justify-center lg:min-w-[160px]">
              <IntroductionButton variant="compact" />
              
              <Button 
                variant="outline" 
                size="sm"
                className={`text-xs sm:text-sm ${
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

export default FundListItem;
