import React from 'react';
import { Fund } from '../../../data/types/funds';
import { CompanyLogo } from '../../shared/CompanyLogo';

interface ComparisonTableHeaderProps {
  funds: Fund[];
}

const ComparisonTableHeader: React.FC<ComparisonTableHeaderProps> = ({ funds }) => {
  return (
    <thead>
      <tr className="border-b bg-muted/30">
        <th className="text-left py-4 px-4 font-semibold text-foreground uppercase text-xs tracking-wider">Criteria</th>
        {funds.map(fund => (
          <th key={fund.id} className="text-center py-4 px-4 font-semibold">
            <div className="flex flex-col items-center gap-3">
              <CompanyLogo managerName={fund.managerName} size="md" />
              <span className="text-sm font-semibold text-foreground">{fund.name}</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default ComparisonTableHeader;
