
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Badge } from '../ui/badge';
import { TableCell, TableRow } from '../ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Lock, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ContentGatingService } from '../../services/contentGatingService';
import PasswordDialog from '../PasswordDialog';

interface FundIndexTableRowProps {
  score: FundScore;
}

const FundIndexTableRow: React.FC<FundIndexTableRowProps> = ({ score }) => {
  const fund = getFundById(score.fundId);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  if (!fund) return null;

  const handleRowClick = () => {
    navigate(`/funds/${fund.id}`);
  };

  const handleGatedCellClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowPasswordDialog(true);
    }
  };

  // Extract current year performance (assuming it's the last part of returnTarget)
  const getCurrentYearPerformance = (returnTarget: string) => {
    // Look for patterns like "8.4% YTD" or "6.3% (2024)" at the end
    const currentYearMatch = returnTarget.match(/(\d+\.?\d*%\s*(?:YTD|\(\d{4}\)))$/);
    if (currentYearMatch) {
      return currentYearMatch[1];
    }
    // Fallback: take the last percentage mentioned
    const percentages = returnTarget.match(/\d+\.?\d*%/g);
    return percentages ? percentages[percentages.length - 1] : returnTarget;
  };

  const currentPerformance = getCurrentYearPerformance(fund.returnTarget);

  return (
    <>
      <TableRow 
        className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 cursor-pointer"
        onClick={handleRowClick}
        itemScope
        itemType="https://schema.org/FinancialProduct"
        itemProp="itemListElement"
      >
        <meta itemProp="identifier" content={fund.id} />
        <meta itemProp="category" content={fund.category} />
        <meta itemProp="url" content={`https://www.movingto.com/funds/${fund.id}`} />
        
        <TableCell className="py-4 w-16">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
            <span itemProp="position">{score.rank}</span>
          </div>
        </TableCell>
        
        <TableCell className="py-4 min-w-48">
          <div className="space-y-1">
            <div 
              className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2"
              itemProp="name"
            >
              {fund.name}
            </div>
            <div 
              className="text-xs text-gray-500"
              itemProp="category"
            >
              {fund.category}
            </div>
          </div>
          <div itemScope itemType="https://schema.org/Organization" itemProp="provider">
            <meta itemProp="name" content={fund.managerName} />
            <meta itemProp="url" content={fund.websiteUrl} />
          </div>
        </TableCell>
        
        <TableCell className="py-4 w-32">
          <div 
            className="text-xs text-gray-700 font-medium truncate" 
            title={fund.managerName}
            itemProp="provider"
            itemScope
            itemType="https://schema.org/Organization"
          >
            <span itemProp="name">{fund.managerName}</span>
          </div>
        </TableCell>
        
        <TableCell className="py-4 w-20 text-center">
          {isAuthenticated ? (
            <div itemScope itemType="https://schema.org/AggregateRating">
              <div 
                className="text-lg font-bold text-blue-600"
                itemProp="ratingValue"
              >
                {score.movingtoScore}
              </div>
              <meta itemProp="bestRating" content="100" />
              <meta itemProp="worstRating" content="0" />
              <meta itemProp="ratingCount" content="1" />
            </div>
          ) : (
            <div 
              className="flex items-center justify-center cursor-pointer hover:bg-blue-50 rounded p-1"
              onClick={handleGatedCellClick}
              title="Score available to MovingTo clients"
            >
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </TableCell>
        
        <TableCell className="py-4 w-24 text-center">
          {isAuthenticated ? (
            <div className="space-y-1">
              <div className="font-semibold text-gray-900 text-sm">{score.performanceScore}</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div 
                      className="text-xs text-gray-600 cursor-help hover:text-gray-800 transition-colors"
                      itemProp="expectedReturn"
                    >
                      {currentPerformance}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">{fund.returnTarget}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <div 
              className="flex items-center justify-center cursor-pointer hover:bg-blue-50 rounded p-1"
              onClick={handleGatedCellClick}
              title="Performance data available to MovingTo clients"
            >
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </TableCell>
        
        <TableCell className="py-4 w-20 text-center">
          {isAuthenticated ? (
            <div itemScope itemType="https://schema.org/PropertyValue">
              <div 
                className="font-semibold text-gray-900 text-sm"
                itemProp="value"
              >
                {fund.managementFee}%
              </div>
              <meta itemProp="name" content="Management Fee" />
            </div>
          ) : (
            <div 
              className="flex items-center justify-center cursor-pointer hover:bg-blue-50 rounded p-1"
              onClick={handleGatedCellClick}
              title="Fee data available to MovingTo clients"
            >
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </TableCell>
        
        <TableCell className="py-4 w-24 text-center">
          <div itemScope itemType="https://schema.org/Offer">
            <div 
              className="font-semibold text-gray-900 text-xs"
              itemProp="price"
            >
              €{(fund.minimumInvestment / 1000).toFixed(0)}k
            </div>
            <meta itemProp="priceCurrency" content="EUR" />
            <meta itemProp="availability" content={fund.fundStatus === 'Open' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
          </div>
        </TableCell>
        
        <TableCell className="py-4 w-20 text-center">
          <Badge 
            variant={fund.fundStatus === 'Open' ? 'default' : 'secondary'}
            className={`text-xs px-2 py-1 ${
              fund.fundStatus === 'Open' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}
            itemProp="availability"
          >
            {fund.fundStatus}
          </Badge>
        </TableCell>
        
        {/* Additional structured data */}
        <div style={{ display: 'none' }}>
          <div itemScope itemType="https://schema.org/PropertyValue">
            <meta itemProp="name" content="Performance Fee" />
            <meta itemProp="value" content={`${fund.performanceFee}%`} />
          </div>
          <div itemScope itemType="https://schema.org/PropertyValue">
            <meta itemProp="name" content="Fund Size" />
            <meta itemProp="value" content={`${fund.fundSize} Million EUR`} />
          </div>
          <div itemScope itemType="https://schema.org/PropertyValue">
            <meta itemProp="name" content="Regulatory Score" />
            <meta itemProp="value" content={score.regulatoryScore.toString()} />
          </div>
          <div itemScope itemType="https://schema.org/PropertyValue">
            <meta itemProp="name" content="Fee Score" />
            <meta itemProp="value" content={score.feeScore.toString()} />
          </div>
          <div itemScope itemType="https://schema.org/PropertyValue">
            <meta itemProp="name" content="Protection Score" />
            <meta itemProp="value" content={score.protectionScore.toString()} />
          </div>
        </div>
      </TableRow>

      <PasswordDialog 
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </>
  );
};

export default FundIndexTableRow;
