
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
    <TableRow className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
      <TableCell className="py-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold text-lg">
            #{score.rank}
          </div>
        </div>
      </TableCell>
      <TableCell className="py-6">
        <div className="space-y-1">
          <div className="font-semibold text-gray-900 text-base leading-tight">{fund.name}</div>
          <div className="text-sm text-gray-500">{fund.category}</div>
        </div>
      </TableCell>
      <TableCell className="py-6">
        <div className="text-sm text-gray-700 font-medium">{fund.managerName}</div>
      </TableCell>
      <TableCell className="py-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 leading-tight">
            {score.movingtoScore}
          </div>
          <div className="text-xs text-gray-400 font-medium">/ 100</div>
        </div>
      </TableCell>
      <TableCell className="py-6">
        <div className="text-center space-y-1">
          <div className="font-semibold text-gray-900">{score.performanceScore}</div>
          <div className="text-xs text-gray-500 leading-tight">{fund.returnTarget}</div>
        </div>
      </TableCell>
      <TableCell className="py-6">
        <div className="text-center">
          <div className="font-semibold text-gray-900 text-base">
            {fund.managementFee}%
          </div>
        </div>
      </TableCell>
      <TableCell className="py-6">
        <div className="text-center">
          <div className="font-semibold text-gray-900">
            €{fund.minimumInvestment.toLocaleString()}
          </div>
        </div>
      </TableCell>
      <TableCell className="py-6">
        <Badge 
          variant={fund.fundStatus === 'Open' ? 'default' : 'secondary'}
          className={`text-xs font-medium px-3 py-1 ${
            fund.fundStatus === 'Open' 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {fund.fundStatus}
        </Badge>
      </TableCell>
      <TableCell className="py-6">
        <Link to={`/funds/${fund.id}`}>
          <Button 
            size="sm" 
            variant="outline" 
            className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
          >
            View Details
            <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default FundIndexTableRow;
