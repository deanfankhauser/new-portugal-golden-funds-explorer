
import React from 'react';
import CompactFilter from './CompactFilter';
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
    <aside className="lg:col-span-1 order-2 lg:order-1 hidden lg:block" aria-label="Sidebar tools">
      <CompactFilter
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </aside>
  );
};

export default HomepageSidebar;
