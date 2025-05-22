
import React from 'react';
import { Fund } from '../../../data/funds';
import ComparisonCell from './ComparisonCell';

interface StandardRowProps {
  funds: Fund[];
  field: keyof Fund | ((fund: Fund) => any);
  label: string;
  formatter?: (value: any) => React.ReactNode;
  allSame: (values: any[]) => boolean;
}

const StandardRow: React.FC<StandardRowProps> = ({ 
  funds, 
  field, 
  label, 
  formatter = (value) => value,
  allSame 
}) => {
  const getValue = (fund: Fund) => {
    if (typeof field === 'function') {
      return field(fund);
    }
    return fund[field];
  };

  const values = funds.map(fund => getValue(fund));
  const highlight = funds.length > 1 && allSame(values);

  return (
    <tr className="border-b">
      <td className="py-3 px-4 font-medium">{label}</td>
      {funds.map(fund => (
        <ComparisonCell 
          key={fund.id} 
          value={formatter(getValue(fund))} 
          highlight={highlight}
        />
      ))}
    </tr>
  );
};

export default StandardRow;
