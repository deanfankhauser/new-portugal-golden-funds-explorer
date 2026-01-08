import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../../data/types/funds';
import { CompanyLogo } from '../../shared/CompanyLogo';
import { Button } from '@/components/ui/button';
import ComparisonSuperpowerBadges from '../ComparisonSuperpowerBadges';

interface ComparisonTableHeaderProps {
  funds: Fund[];
}

const ComparisonTableHeader: React.FC<ComparisonTableHeaderProps> = ({ funds }) => {
  return (
    <thead className="sticky top-0 z-20 bg-card shadow-sm">
      <tr className="border-b bg-muted/30">
        <th className="text-left py-4 px-4 font-semibold text-foreground uppercase text-xs tracking-wider sticky left-0 bg-muted/30 z-10">Criteria</th>
        {funds.map((fund, index) => {
          const comparisonFund = funds[index === 0 ? 1 : 0];
          return (
            <th key={fund.id} className="text-center py-4 px-4 font-semibold min-w-[240px]">
              <div className="flex flex-col items-center gap-3">
                <CompanyLogo managerName={fund.managerName} size="md" />
                <span className="text-sm font-semibold text-foreground">{fund.name}</span>
                {comparisonFund && (
                  <ComparisonSuperpowerBadges fund={fund} comparisonFund={comparisonFund} />
                )}
                <div className="flex gap-2 mt-1">
                  <Button size="sm" variant="default" asChild>
                    <Link to={`/${fund.id}`}>View Details</Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/${fund.id}#enquiry`}>Inquire</Link>
                  </Button>
                </div>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default ComparisonTableHeader;
