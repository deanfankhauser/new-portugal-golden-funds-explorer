
import React from 'react';
import FundListItem from '../FundListItem';
import { Fund } from '@/data/types/funds';
import { URL_CONFIG } from '../../utils/urlConfig';

interface TagPageFundListProps {
  funds: Fund[];
}

const TagPageFundList = ({ funds }: TagPageFundListProps) => {
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

export default TagPageFundList;
