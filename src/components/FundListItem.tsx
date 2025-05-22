
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../data/funds';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GitCompare, PieChart, Globe, Tag } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import IntroductionButton from './fund-details/IntroductionButton';
import { formatPercentage } from './fund-details/utils/formatters';

interface FundListItemProps {
  fund: Fund;
}

const FundListItem: React.FC<FundListItemProps> = ({ fund }) => {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  
  const isSelected = isInComparison(fund.id);
  
  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to fund details
    
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

  return (
    <Card className="border rounded-lg hover:border-gray-300 transition-colors bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-semibold">
                <Link to={`/funds/${fund.id}`} className="hover:text-[#EF4444] transition-colors">
                  {fund.name}
                </Link>
              </h3>
              {fund.fundStatus === 'Closing Soon' && (
                <Badge className="bg-amber-500 ml-2">
                  Closing Soon
                </Badge>
              )}
              {fund.fundStatus === 'Closed' && (
                <Badge className="bg-red-600 ml-2">
                  Closed
                </Badge>
              )}
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2">{fund.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2 text-[#EF4444]" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">
                    <Link to={`/categories/${encodeURIComponent(fund.category)}`} className="hover:text-[#EF4444] transition-colors">
                      {fund.category}
                    </Link>
                  </p>
                </div>
              </div>
              
              {mainGeoAllocation && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-[#EF4444]" />
                  <div>
                    <p className="text-sm text-muted-foreground">Main Region</p>
                    <p className="font-medium">{mainGeoAllocation.region} ({formatPercentage(mainGeoAllocation.percentage)})</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <PieChart className="w-4 h-4 mr-2 text-[#EF4444]" />
                <div>
                  <p className="text-sm text-muted-foreground">Target Return</p>
                  <p className="font-medium">{fund.returnTarget}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {fund.tags.map((tag) => (
                <Link 
                  key={tag} 
                  to={`/tags/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}`}
                  className="text-xs bg-secondary hover:bg-primary hover:text-white px-2 py-1 rounded-full transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 justify-center min-w-[160px]">
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
            >
              <GitCompare className="mr-1 h-3 w-3" />
              {isSelected ? 'Added to Compare' : 'Compare'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundListItem;
