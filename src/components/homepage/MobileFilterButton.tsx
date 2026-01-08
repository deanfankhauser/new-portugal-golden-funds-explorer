import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { FundTag, FundCategory } from '../../data/types/funds';
import CategoryFilter from './CategoryFilter';
import ManagerFilter from './ManagerFilter';
import StreamlinedFilter from './StreamlinedFilter';

interface MobileFilterButtonProps {
  selectedTags: FundTag[];
  setSelectedTags: (tags: FundTag[]) => void;
  selectedCategory: FundCategory | null;
  setSelectedCategory: (category: FundCategory | null) => void;
  selectedManager: string | null;
  setSelectedManager: (manager: string | null) => void;
}

const MobileFilterButton: React.FC<MobileFilterButtonProps> = ({
  selectedTags,
  setSelectedTags,
  selectedCategory,
  setSelectedCategory,
  selectedManager,
  setSelectedManager
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show after scrolling past 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const activeFilterCount = selectedTags.length + 
    (selectedCategory ? 1 : 0) + 
    (selectedManager ? 1 : 0);

  if (!isVisible) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-all duration-300 lg:hidden h-14 w-14 rounded-full"
          aria-label={`Open filters ${activeFilterCount > 0 ? `(${activeFilterCount} active)` : ''}`}
        >
          <Filter className="h-6 w-6" />
          {activeFilterCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Funds</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="bg-card rounded-lg border p-4">
            <CategoryFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <ManagerFilter
              selectedManager={selectedManager}
              setSelectedManager={setSelectedManager}
            />
          </div>
          
          <StreamlinedFilter
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
          
          {activeFilterCount > 0 && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSelectedTags([]);
                setSelectedCategory(null);
                setSelectedManager(null);
                setIsOpen(false);
              }}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterButton;
