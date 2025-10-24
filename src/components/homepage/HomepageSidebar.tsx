
import React from 'react';
import StreamlinedFilter from './StreamlinedFilter';
import { FundTag } from '../../data/funds';

interface HomepageSidebarProps {
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const HomepageSidebar: React.FC<HomepageSidebarProps> = ({
  selectedTags,
  setSelectedTags,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <aside className="lg:col-span-1 order-2 lg:order-1" aria-label="Sidebar tools">
      <div className="sticky top-4">
        <StreamlinedFilter
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </aside>
  );
};

export default HomepageSidebar;
