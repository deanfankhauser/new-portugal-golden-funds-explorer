
import React from 'react';
import StreamlinedFilter from './StreamlinedFilter';
import CategoryFilter from './CategoryFilter';
import { FundTag, FundCategory } from '../../data/funds';

interface HomepageSidebarProps {
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
  selectedCategory: FundCategory | null;
  setSelectedCategory: (category: FundCategory | null) => void;
  showOnlyVerified: boolean;
  setShowOnlyVerified: (value: boolean) => void;
}

const HomepageSidebar: React.FC<HomepageSidebarProps> = ({
  selectedTags,
  setSelectedTags,
  selectedCategory,
  setSelectedCategory,
  showOnlyVerified,
  setShowOnlyVerified
}) => {
  return (
    <aside className="lg:col-span-1 order-2 lg:order-1" aria-label="Sidebar tools">
      <div className="lg:sticky lg:top-4 space-y-4">
        <StreamlinedFilter
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          showOnlyVerified={showOnlyVerified}
          setShowOnlyVerified={setShowOnlyVerified}
        />
        
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      </div>
    </aside>
  );
};

export default HomepageSidebar;
