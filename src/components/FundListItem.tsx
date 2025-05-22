
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../data/funds';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitCompare } from 'lucide-react';

interface FundListItemProps {
  fund: Fund;
}

const FundListItem: React.FC<FundListItemProps> = ({ fund }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="border rounded-lg p-4 hover:border-portugal-blue transition-colors bg-white shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold mb-2">
              <Link to={`/funds/${fund.id}`} className="hover:text-portugal-blue transition-colors">
                {fund.name}
              </Link>
            </h3>
            <Badge 
              className={`
                ml-2 whitespace-nowrap
                ${fund.fundStatus === 'Open' ? 'bg-green-600' : ''} 
                ${fund.fundStatus === 'Closing Soon' ? 'bg-amber-500' : ''}
                ${fund.fundStatus === 'Closed' ? 'bg-red-600' : ''}
              `}
            >
              {fund.fundStatus}
            </Badge>
          </div>
          
          <p className="text-gray-600 mb-3 line-clamp-2">{fund.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
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
            className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white mt-2"
          >
            <GitCompare className="mr-1 h-3 w-3" />
            Compare
          </Button>
        </div>
        
        <div className="flex flex-row md:flex-col gap-4 md:min-w-[180px] md:text-right">
          <div>
            <p className="text-sm text-muted-foreground">Min Investment</p>
            <p className="font-medium">{formatCurrency(fund.minimumInvestment)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Target Return</p>
            <p className="font-medium">{fund.returnTarget}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundListItem;
