import React from 'react';
import { Fund } from '../../../data/types/funds';
import { CompanyLogo } from '../../shared/CompanyLogo';

interface ComparisonTableHeaderProps {
  funds: Fund[];
}

const ComparisonTableHeader: React.FC<ComparisonTableHeaderProps> = ({ funds }) => {
  return (
    <thead>
      <tr className="border-b">
        <th className="text-left py-3 px-4 font-semibold bg-muted/50">Criteria</th>
        {funds.map(fund => (
          <th key={fund.id} className="text-center py-3 px-4 font-semibold bg-muted/50">
            <div className="flex flex-col items-center gap-2">
              <CompanyLogo managerName={fund.managerName} size="md" />
              <span className="text-left">{fund.name}</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default ComparisonTableHeader;
