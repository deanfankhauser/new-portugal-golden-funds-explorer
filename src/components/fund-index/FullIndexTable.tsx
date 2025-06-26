
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpDown, ExternalLink, Filter } from 'lucide-react';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface FullIndexTableProps {
  scores: FundScore[];
}

type SortField = 'rank' | 'name' | 'score' | 'performance' | 'fees' | 'minInvestment';
type SortDirection = 'asc' | 'desc';

const FullIndexTable: React.FC<FullIndexTableProps> = ({ scores }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filteredAndSortedScores = useMemo(() => {
    let filtered = scores.filter(score => {
      const fund = getFundById(score.fundId);
      if (!fund) return false;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        fund.name.toLowerCase().includes(searchLower) ||
        fund.managerName.toLowerCase().includes(searchLower) ||
        fund.category.toLowerCase().includes(searchLower)
      );
    });

    filtered.sort((a, b) => {
      const fundA = getFundById(a.fundId);
      const fundB = getFundById(b.fundId);
      if (!fundA || !fundB) return 0;

      let valueA: any, valueB: any;
      
      switch (sortField) {
        case 'rank':
          valueA = a.rank;
          valueB = b.rank;
          break;
        case 'name':
          valueA = fundA.name;
          valueB = fundB.name;
          break;
        case 'score':
          valueA = a.movingtoScore;
          valueB = b.movingtoScore;
          break;
        case 'performance':
          valueA = a.performanceScore;
          valueB = b.performanceScore;
          break;
        case 'fees':
          valueA = fundA.managementFee;
          valueB = fundB.managementFee;
          break;
        case 'minInvestment':
          valueA = fundA.minimumInvestment;
          valueB = fundB.minimumInvestment;
          break;
        default:
          valueA = a.rank;
          valueB = b.rank;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortDirection === 'asc' 
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    });

    return filtered;
  }, [scores, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead>
      <Button 
        variant="ghost" 
        onClick={() => handleSort(field)}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        {children}
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    </TableHead>
  );

  return (
    <Card id="full-index">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-green-500" />
          Complete Fund Index
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search funds, managers, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-500 self-center">
            Showing {filteredAndSortedScores.length} of {scores.length} funds
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="rank">Rank</SortableHeader>
                <SortableHeader field="name">Fund Name</SortableHeader>
                <TableHead>Manager</TableHead>
                <SortableHeader field="score">Movingto Score</SortableHeader>
                <SortableHeader field="performance">Performance</SortableHeader>
                <SortableHeader field="fees">Mgmt Fee</SortableHeader>
                <SortableHeader field="minInvestment">Min Investment</SortableHeader>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedScores.map((score) => {
                const fund = getFundById(score.fundId);
                if (!fund) return null;

                return (
                  <TableRow key={fund.id} className="hover:bg-gray-50">
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
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FullIndexTable;
