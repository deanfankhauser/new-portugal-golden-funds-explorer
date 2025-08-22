
import React from 'react';

interface ComparisonCellProps {
  value: React.ReactNode;
  highlight?: boolean;
}

const ComparisonCell: React.FC<ComparisonCellProps> = ({ value, highlight = false }) => {
  return (
    <td className={`py-3 px-4 ${highlight ? "bg-success/10" : ""}`}>
      {value}
    </td>
  );
};

export default ComparisonCell;
