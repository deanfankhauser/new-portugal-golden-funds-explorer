
import React from 'react';
import { Fund } from '../../../data/funds';

interface ComparisonTableHeaderProps {
  funds: Fund[];
}

const ComparisonTableHeader: React.FC<ComparisonTableHeaderProps> = ({ funds }) => {
  return (
    <thead>
      <tr className="border-b">
        <th className="text-left py-3 px-4 font-semibold bg-muted/50">Criteria</th>
        {funds.map(fund => (
          <th key={fund.id} className="text-left py-3 px-4 font-semibold bg-muted/50">
            {fund.name}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default ComparisonTableHeader;
