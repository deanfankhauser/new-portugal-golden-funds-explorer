
import React from 'react';
import { Fund } from '../../data/funds';
import FundListItem from '../FundListItem';
import { URL_CONFIG } from '../../utils/urlConfig';

interface CategoryPageFundListProps {
  funds: Fund[];
}

const CategoryPageFundList: React.FC<CategoryPageFundListProps> = ({ funds }) => {
  return (
    <div className="space-y-4">
      {funds.map((fund, index) => (
        <div key={fund.id}>
          <FundListItem fund={fund} />
        </div>
      ))}
    </div>
  );
};

export default CategoryPageFundList;
