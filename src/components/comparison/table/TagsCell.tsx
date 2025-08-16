
import React from 'react';
import { Link } from 'react-router-dom';
import { FundTag } from '../../../data/funds';
import { tagToSlug } from '../../../lib/utils';
import ComparisonCell from './ComparisonCell';

interface TagsCellProps {
  tags: FundTag[];
  highlight?: boolean;
}

const TagsCell: React.FC<TagsCellProps> = ({ tags, highlight = false }) => {
  const content = (
    <div className="flex flex-wrap gap-1">
      {tags.map(tag => (
        <Link
          key={tag}
          to={`/tags/${tagToSlug(tag)}`}
          className="text-xs bg-secondary hover:bg-primary hover:text-white px-2 py-1 rounded-full transition-colors duration-200"
          title={`View all funds tagged with ${tag}`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );

  return <ComparisonCell value={content} highlight={highlight} />;
};

export default TagsCell;
