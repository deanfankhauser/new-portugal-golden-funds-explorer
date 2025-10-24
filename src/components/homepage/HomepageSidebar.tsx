
import React from 'react';
import StreamlinedFilter from './StreamlinedFilter';
import { FundTag } from '../../data/funds';

interface HomepageSidebarProps {
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
}

const HomepageSidebar: React.FC<HomepageSidebarProps> = ({
  selectedTags,
  setSelectedTags,
}) => {
  return (
    <aside className="lg:col-span-1 order-2 lg:order-1" aria-label="Sidebar tools">
      <div className="lg:sticky lg:top-4 space-y-4">
        <StreamlinedFilter
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </div>
    </aside>
  );
};

export default HomepageSidebar;
