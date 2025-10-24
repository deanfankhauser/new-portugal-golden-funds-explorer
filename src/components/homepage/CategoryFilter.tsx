import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { getAllCategories, getFundsByCategory } from '@/data/services/categories-service';
import { FundCategory } from '@/data/types/funds';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';

interface CategoryFilterProps {
  selectedCategory: FundCategory | null;
  setSelectedCategory: (category: FundCategory | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  setSelectedCategory
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { funds } = useRealTimeFunds();
  const categories = getAllCategories();

  const getCategoryCount = (category: FundCategory): number => {
    return funds.filter(fund => fund.category === category).length;
  };

  const handleCategoryClick = (category: FundCategory) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto hover:bg-muted"
        >
          <span className="font-semibold text-base">Filter by categories</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-2 pt-2">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const count = getCategoryCount(category);
            const isSelected = selectedCategory === category;
            
            return (
              <Button
                key={category}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(category)}
                className="text-left justify-start"
              >
                {category} ({count})
              </Button>
            );
          })}
        </div>

        <Link
          to="/categories"
          className="flex items-center gap-2 text-sm text-primary hover:underline pt-2"
        >
          See all categories
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CategoryFilter;