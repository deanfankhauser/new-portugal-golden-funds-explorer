
import React from 'react';
import StreamlinedFilter from './StreamlinedFilter';
import CategoryFilter from './CategoryFilter';
import ManagerFilter from './ManagerFilter';
import { FundTag, FundCategory } from '../../data/funds';

interface HomepageSidebarProps {
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
  selectedCategory: FundCategory | null;
  setSelectedCategory: (category: FundCategory | null) => void;
  selectedManager: string | null;
  setSelectedManager: (manager: string | null) => void;
}

const HomepageSidebar: React.FC<HomepageSidebarProps> = ({
  selectedTags,
  setSelectedTags,
  selectedCategory,
  setSelectedCategory,
  selectedManager,
  setSelectedManager
}) => {
  return (
    <aside className="lg:col-span-1 order-2 lg:order-1" aria-label="Sidebar tools">
      <div className="sticky top-4 space-y-4">
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <ManagerFilter
            selectedManager={selectedManager}
            setSelectedManager={setSelectedManager}
          />
        </div>
        
        <StreamlinedFilter
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </div>
    </aside>
  );
};

export default HomepageSidebar;
