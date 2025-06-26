
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TableCell, TableRow } from '../ui/table';

interface FundIndexTableRowProps {
  score: FundScore;
}

const FundIndexTableRow: React.FC<FundIndexTableRowProps> = ({ score }) => {
  const fund = getFundById(score.fundId);
  
  if (!fund) return null;

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">#{score.rank}</span>
          {score.rank <= 3 && (
            <Badge variant="secondary" className="text-xs">
              Top {score.rank}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-semibold">{fund.name}</div>
          <div className="text-sm text-gray-500">{fund.category}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">{fund.managerName}</div>
      </TableCell>
      <TableCell>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">
            {score.movingtoScore}
          </div>
          <div className="text-xs text-gray-500">/ 100</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-center">
          <div className="font-semibold">{score.performanceScore}</div>
          <div className="text-xs text-gray-500">{fund.returnTarget}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-center font-semibold">
          {fund.managementFee}%
        </div>
      </TableCell>
      <TableCell>
        <div className="text-center font-semibold">
          €{fund.minimumInvestment.toLocaleString()}
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant={fund.fundStatus === 'Open' ? 'default' : 'secondary'}
          className="text-xs"
        >
          {fund.fundStatus}
        </Badge>
      </TableCell>
      <TableCell>
        <Link to={`/funds/${fund.id}`}>
          <Button size="sm" variant="outline">
            View Details
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default FundIndexTableRow;
