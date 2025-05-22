
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../data/funds';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitCompare, User } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';

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
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">
            <Link to={`/funds/${fund.id}`} className="hover:text-portugal-blue transition-colors">
              {fund.name}
            </Link>
          </CardTitle>
          <Badge 
            className={`
              ${fund.fundStatus === 'Open' ? 'bg-green-600' : ''} 
              ${fund.fundStatus === 'Closing Soon' ? 'bg-amber-500' : ''}
              ${fund.fundStatus === 'Closed' ? 'bg-red-600' : ''}
            `}
          >
            {fund.fundStatus}
          </Badge>
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
          <div>
            <p className="text-sm text-muted-foreground">Fund Manager</p>
            <p className="font-medium">{fund.managerName}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center mt-4">
          <div className="flex flex-wrap gap-1">
            {fund.tags.map((tag) => (
              <Link 
                key={tag} 
                to={`/tags/${encodeURIComponent(tag)}`}
                className="text-xs bg-secondary hover:bg-primary hover:text-white px-2 py-1 rounded-full transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className={`${
              isSelected 
                ? 'bg-[#EF4444] text-white' 
                : 'border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white'
            } mt-2`}
            onClick={handleCompareClick}
          >
            <GitCompare className="mr-1 h-3 w-3" />
            {isSelected ? 'Added to Compare' : 'Compare'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundCard;
