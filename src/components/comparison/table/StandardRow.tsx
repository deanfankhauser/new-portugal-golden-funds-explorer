
import React from 'react';
import { Fund } from '../../../data/types/funds';
import ComparisonCell from './ComparisonCell';

interface StandardRowProps {
  funds: Fund[];
  field: keyof Fund | ((fund: Fund) => any);
  label: string;
  formatter?: (value: any) => React.ReactNode;
  allSame: (values: any[]) => boolean;
  bestType?: 'lowest' | 'highest' | null;
}

const StandardRow: React.FC<StandardRowProps> = ({ 
  funds, 
  field, 
  label, 
  formatter = (value) => value,
  allSame,
  bestType = null
}) => {
  const getValue = (fund: Fund) => {
    if (typeof field === 'function') {
      return field(fund);
    }
    return fund[field];
  };

  const values = funds.map(fund => getValue(fund));
  const highlight = funds.length > 1 && allSame(values);

  // Calculate best value index if bestType is specified and we have multiple funds
  let bestIndex = -1;
  if (bestType && funds.length > 1) {
    const numericValues = values.map(v => {
      if (typeof v === 'number') return v;
      if (typeof v === 'string') {
        // Extract numeric value from strings like "5%" or "€500,000" or "5M EUR"
        const match = v.replace(/[€,]/g, '').match(/[\d.]+/);
        return match ? parseFloat(match[0]) : null;
      }
      return null;
    });

    // Only find best if we have at least one valid numeric value
    if (numericValues.some(v => v !== null)) {
      if (bestType === 'lowest') {
        let minValue = Infinity;
        numericValues.forEach((val, idx) => {
          if (val !== null && val < minValue) {
            minValue = val;
            bestIndex = idx;
          }
        });
      } else if (bestType === 'highest') {
        let maxValue = -Infinity;
        numericValues.forEach((val, idx) => {
          if (val !== null && val > maxValue) {
            maxValue = val;
            bestIndex = idx;
          }
        });
      }
    }
  }

  return (
    <tr className="border-b">
      <td className="py-3 px-4 font-medium">{label}</td>
      {funds.map((fund, idx) => (
        <ComparisonCell 
          key={fund.id} 
          value={formatter(getValue(fund))} 
          highlight={highlight}
          isBest={bestIndex === idx}
        />
      ))}
    </tr>
  );
};

export default StandardRow;
