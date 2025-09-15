import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Badge } from '../ui/badge';
import { TableCell, TableRow } from '../ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import DataFreshnessIndicator from '../common/DataFreshnessIndicator';

interface FundIndexTableRowProps {
  score: FundScore;
}

const FundIndexTableRow: React.FC<FundIndexTableRowProps> = ({ score }) => {
  const fund = getFundById(score.fundId);
  const navigate = useNavigate();
  
  if (!fund) return null;

  const handleRowClick = () => {
    window.scrollTo(0, 0);
    navigate(`/${fund.id}`);
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
    <TableRow 
      className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 cursor-pointer"
      onClick={handleRowClick}
      itemScope
      itemType="https://schema.org/FinancialProduct"
      itemProp="itemListElement"
    >
      <meta itemProp="identifier" content={fund.id} />
      <meta itemProp="category" content={fund.category} />
      <meta itemProp="url" content={`https://funds.movingto.com/${fund.id}`} />
      
      <TableCell className="py-4 w-16">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-sm">
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
            className="text-xs text-foreground font-medium truncate" 
            title={fund.managerName}
            itemProp="provider"
            itemScope
            itemType="https://schema.org/Organization"
          >
            <span itemProp="name">{fund.managerName}</span>
          </div>
      </TableCell>
      
      <TableCell className="py-4 w-20 text-center">
        <div itemScope itemType="https://schema.org/AggregateRating">
          <div 
            className="text-lg font-bold text-accent"
            itemProp="ratingValue"
          >
            {score.movingtoScore}
          </div>
          <meta itemProp="bestRating" content="100" />
          <meta itemProp="worstRating" content="0" />
          <meta itemProp="ratingCount" content="1" />
        </div>
      </TableCell>
      
      <TableCell className="py-4 w-24 text-center">
        <div className="space-y-1">
          <div className="font-semibold text-foreground text-sm">{score.performanceScore}</div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div 
                  className="text-xs text-muted-foreground cursor-help hover:text-foreground transition-colors"
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
      </TableCell>
      
      <TableCell className="py-4 w-20 text-center">
        <div itemScope itemType="https://schema.org/PropertyValue">
          <div 
            className="font-semibold text-foreground text-sm"
            itemProp="value"
          >
            {fund.managementFee}%
          </div>
          <meta itemProp="name" content="Management Fee" />
        </div>
      </TableCell>
      
      <TableCell className="py-4 w-24 text-center">
        <div itemScope itemType="https://schema.org/Offer">
          <div 
            className="font-semibold text-foreground text-xs"
            itemProp="price"
          >
            €{(fund.minimumInvestment / 1000).toFixed(0)}k
          </div>
          <meta itemProp="priceCurrency" content="EUR" />
          <meta itemProp="availability" content={fund.fundStatus === 'Open' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
        </div>
      </TableCell>
      
      <TableCell className="py-4 w-20 text-center">
        <div className="space-y-1">
          <Badge 
            variant={fund.fundStatus === 'Open' ? 'default' : 'secondary'}
            className={`text-xs px-2 py-1 ${
              fund.fundStatus === 'Open' 
                ? 'bg-success/10 text-success' 
                : 'bg-muted text-muted-foreground'
            }`}
            itemProp="availability"
          >
            {fund.fundStatus}
          </Badge>
          <DataFreshnessIndicator fund={fund} variant="dot" className="mx-auto" />
        </div>
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
  );
};

export default FundIndexTableRow;