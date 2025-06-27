
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Badge } from '../ui/badge';
import { TableCell, TableRow } from '../ui/table';

interface FundIndexTableRowProps {
  score: FundScore;
}

const FundIndexTableRow: React.FC<FundIndexTableRowProps> = ({ score }) => {
  const fund = getFundById(score.fundId);
  const navigate = useNavigate();
  
  if (!fund) return null;

  const handleRowClick = () => {
    navigate(`/funds/${fund.id}`);
  };

  return (
    <TableRow 
      className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 cursor-pointer"
      onClick={handleRowClick}
    >
      <TableCell className="py-4 w-16">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
          {score.rank}
        </div>
      </TableCell>
      <TableCell className="py-4 min-w-48">
        <div className="space-y-1">
          <div className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{fund.name}</div>
          <div className="text-xs text-gray-500">{fund.category}</div>
        </div>
      </TableCell>
      <TableCell className="py-4 w-32">
        <div className="text-xs text-gray-700 font-medium truncate" title={fund.managerName}>
          {fund.managerName}
        </div>
      </TableCell>
      <TableCell className="py-4 w-20 text-center">
        <div className="text-lg font-bold text-blue-600">
          {score.movingtoScore}
        </div>
      </TableCell>
      <TableCell className="py-4 w-24 text-center">
        <div className="space-y-1">
          <div className="font-semibold text-gray-900 text-sm">{score.performanceScore}</div>
          <div className="text-xs text-gray-500 truncate">{fund.returnTarget}</div>
        </div>
      </TableCell>
      <TableCell className="py-4 w-20 text-center">
        <div className="font-semibold text-gray-900 text-sm">
          {fund.managementFee}%
        </div>
      </TableCell>
      <TableCell className="py-4 w-24 text-center">
        <div className="font-semibold text-gray-900 text-xs">
          €{(fund.minimumInvestment / 1000).toFixed(0)}k
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
        >
          {fund.fundStatus}
        </Badge>
      </TableCell>
    </TableRow>
  );
};

export default FundIndexTableRow;
