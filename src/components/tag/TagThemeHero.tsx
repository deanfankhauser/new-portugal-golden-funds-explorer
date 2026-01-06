import React from 'react';
import { Fund } from '../../data/types/funds';
import { pluralize } from '../../utils/textHelpers';

interface TagThemeHeroProps {
  tagName: string;
  funds: Fund[];
}

const TagThemeHero: React.FC<TagThemeHeroProps> = ({ tagName, funds }) => {
  const totalCount = funds.length;

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Portugal {tagName} Investment Funds
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse {totalCount} {pluralize(totalCount, 'fund')} specializing in {tagName} marketed for the Golden Visa route.
        </p>
      </div>
    </div>
  );
};

export default TagThemeHero;
