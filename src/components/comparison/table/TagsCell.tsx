
import React from 'react';
import { FundTag } from '../../../data/funds';
import ComparisonCell from './ComparisonCell';

interface TagsCellProps {
  tags: FundTag[];
  highlight?: boolean;
}

const TagsCell: React.FC<TagsCellProps> = ({ tags, highlight = false }) => {
  const content = (
    <div className="flex flex-wrap gap-1">
      {tags.map(tag => (
        <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-full">
          {tag}
        </span>
      ))}
    </div>
  );

  return <ComparisonCell value={content} highlight={highlight} />;
};

export default TagsCell;
