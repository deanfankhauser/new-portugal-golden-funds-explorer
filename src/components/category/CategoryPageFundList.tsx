
import React from 'react';
import { Fund } from '../../data/funds';
import FundListItem from '../FundListItem';
import { URL_CONFIG } from '../../utils/urlConfig';

interface CategoryPageFundListProps {
  funds: Fund[];
}

const CategoryPageFundList: React.FC<CategoryPageFundListProps> = ({ funds }) => {
  return (
    <div className="space-y-4" itemProp="itemListElement" itemScope itemType="https://schema.org/ItemList">
      {funds.map((fund, index) => (
        <div key={fund.id} itemProp="item" itemScope itemType="https://schema.org/Product">
          <meta itemProp="position" content={`${index + 1}`} />
          <meta itemProp="name" content={fund.name} />
          <meta itemProp="description" content={fund.description} />
          <meta itemProp="url" content={URL_CONFIG.buildFundUrl(fund.id)} />
          <FundListItem fund={fund} />
        </div>
      ))}
    </div>
  );
};

export default CategoryPageFundList;
