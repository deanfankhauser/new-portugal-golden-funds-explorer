
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { FundTag } from '../../data/funds';
import { useAuth } from '../../contexts/AuthContext';

interface QuickFiltersSectionProps {
  selectedTags: FundTag[];
  onToggleTag: (tag: FundTag) => void;
}

const QuickFiltersSection: React.FC<QuickFiltersSectionProps> = ({
  selectedTags,
  onToggleTag
}) => {
  const { isAuthenticated } = useAuth();

  const quickFilters = [
    { label: 'Low Risk', tag: 'Low Risk' as FundTag },
    { label: 'Real Estate', tag: 'Real Estate' as FundTag },
    { label: 'Under €300k', tag: 'Under €350k Investment' as FundTag },
    { label: 'Open Now', tag: 'Open' as FundTag },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <label className="text-sm font-semibold text-gray-700">Popular Filters</label>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickFilters.map(filter => (
          <Badge
            key={filter.label}
            variant={selectedTags.includes(filter.tag) ? "default" : "outline"}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 px-3 py-1.5 rounded-full ${
              selectedTags.includes(filter.tag)
                ? 'bg-primary text-white shadow-md'
                : 'hover:bg-primary/10 hover:text-primary hover:border-primary'
            }`}
            onClick={() => onToggleTag(filter.tag)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default QuickFiltersSection;
