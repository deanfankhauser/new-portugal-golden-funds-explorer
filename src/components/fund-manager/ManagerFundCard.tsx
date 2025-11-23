import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, TrendingUp, Lock, Calendar } from 'lucide-react';
import { Fund } from '@/data/types/funds';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/components/fund-details/utils/formatters';

interface ManagerFundCardProps {
  fund: Fund;
}

const ManagerFundCard: React.FC<ManagerFundCardProps> = ({ fund }) => {
  const hasGVTag = fund.tags?.some(tag => 
    tag.toLowerCase().includes('golden visa') || tag.toLowerCase().includes('gv eligible')
  );

  // Determine structure
  const getStructure = () => {
    if (fund.tags?.some(tag => tag.toLowerCase().includes('open-ended'))) return 'Open-ended';
    if (fund.tags?.some(tag => tag.toLowerCase().includes('closed-ended'))) return 'Closed-ended';
    return null;
  };

  const structure = getStructure();

  // Get redemption/liquidity info
  const getLiquidity = () => {
    if (fund.redemptionTerms?.frequency) {
      return fund.redemptionTerms.frequency;
    }
    return null;
  };

  return (
    <div className="bg-background border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
      {/* Fund Name & Badges */}
      <div className="mb-4">
        <Link to={`/${fund.id}`} className="group">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-3">
            {fund.name}
          </h3>
        </Link>
        
        <div className="flex flex-wrap gap-2">
          {hasGVTag && (
            <Badge variant="success" className="text-xs">
              Golden Visa Eligible
            </Badge>
          )}
          {fund.category && (
            <Badge variant="outline" className="text-xs">
              {fund.category}
            </Badge>
          )}
          {structure && (
            <Badge variant="outline" className="text-xs">
              {structure}
            </Badge>
          )}
          {fund.tags?.some(tag => tag.toLowerCase().includes('ucits')) && (
            <Badge variant="outline" className="text-xs">
              UCITS
            </Badge>
          )}
        </div>
      </div>

      {/* Description */}
      {fund.description && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-2">
          {fund.description}
        </p>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
        {/* Minimum Investment */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Minimum Investment</p>
          <p className="text-sm font-semibold text-foreground">
            {fund.minimumInvestment ? formatCurrency(fund.minimumInvestment) : 'Not disclosed'}
          </p>
        </div>

        {/* Target Return */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Target Annual Return</p>
          <p className="text-sm font-semibold text-foreground">
            {fund.expectedReturnMin && fund.expectedReturnMax 
              ? `${fund.expectedReturnMin}–${fund.expectedReturnMax}%`
              : fund.expectedReturnMin 
                ? `${fund.expectedReturnMin}% p.a.`
                : 'Not disclosed'
            }
          </p>
        </div>

        {/* Structure */}
        {structure && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Structure</p>
            <p className="text-sm font-semibold text-foreground">{structure}</p>
          </div>
        )}

        {/* Liquidity */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Liquidity</p>
          <p className="text-sm font-semibold text-foreground">
            {getLiquidity() || 'See fund details'}
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="default" size="sm">
          <Link to={`/${fund.id}`}>
            View Fund Details
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="sm">
          <Link to={`/compare?funds=${fund.id}`}>
            Compare
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm">
          <a href="#contact-form">
            Get Introduction
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ManagerFundCard;
