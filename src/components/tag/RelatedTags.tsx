
import React from 'react';
import { Link } from 'react-router-dom';
import { tagToSlug } from '@/lib/utils';

interface RelatedTagsProps {
  allTags: string[];
  currentTag: string;
}

const RelatedTags = ({ allTags, currentTag }: RelatedTagsProps) => {
  return (
    <div className="mt-8 pt-4 border-t border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Related Tags</h2>
      <div className="flex flex-wrap gap-2">
        {allTags
          .filter(tag => tag !== currentTag)
          .slice(0, 10)
          .map(tag => (
            <Link 
              key={tag} 
              to={`/tags/${tagToSlug(tag)}`}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-sm"
            >
              {tag}
            </Link>
          ))
        }
      </div>
    </div>
  );
};

export default RelatedTags;
