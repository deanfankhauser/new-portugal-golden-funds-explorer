
import React from 'react';
import { Link } from 'react-router-dom';
import { tagToSlug } from '@/lib/utils';

interface TagsHubTagsListProps {
  allTags: string[];
}

const TagsHubTagsList = ({ allTags }: TagsHubTagsListProps) => {
  return (
    <section className="bg-card p-4 sm:p-6 rounded-lg shadow-sm" aria-labelledby="tags-heading">
      <h2 id="tags-heading" className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Portugal Golden Visa Investment Fund Tags ({allTags.length})</h2>
      
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {allTags.map((tag, index) => (
          <li key={tag} 
            className="border border-border rounded-lg hover:shadow-md transition-all duration-300"
          >
            <Link 
              to={`/tags/${tagToSlug(tag)}`} 
              className="p-3 sm:p-4 flex items-center justify-between hover:bg-muted"
            >
              <div>
                <span className="font-medium text-base sm:text-lg text-foreground">{tag}</span>
              </div>
              <span className="text-primary">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TagsHubTagsList;
