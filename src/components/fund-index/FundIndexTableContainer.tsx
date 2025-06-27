
import React from 'react';
import { FundScore } from '../../services/fundScoringService';
import { Table, TableBody } from '../ui/table';
import FundIndexMobileCard from './FundIndexMobileCard';
import FundIndexTableRow from './FundIndexTableRow';
import FundIndexTableHeader from './FundIndexTableHeader';
import { SortField } from './FilterAndSortLogic';

interface FundIndexTableContainerProps {
  paginatedScores: FundScore[];
  sortField: SortField;
  onSort: (field: SortField) => void;
}

const FundIndexTableContainer: React.FC<FundIndexTableContainerProps> = ({
  paginatedScores,
  sortField,
  onSort
}) => {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-b-lg overflow-hidden">
          <Table>
            <FundIndexTableHeader
              sortField={sortField}
              onSort={onSort}
            />
            <TableBody className="bg-white">
              {paginatedScores.map((score) => (
                <FundIndexTableRow key={score.fundId} score={score} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-6">
        {paginatedScores.map((score) => (
          <FundIndexMobileCard key={score.fundId} score={score} />
        ))}
      </div>
    </>
  );
};

export default FundIndexTableContainer;
