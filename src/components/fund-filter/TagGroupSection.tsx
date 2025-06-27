
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { FundTag, getAllTags } from '../../data/funds';

interface TagGroupSectionProps {
  selectedTags: FundTag[];
  onToggleTag: (tag: FundTag) => void;
}

const TagGroupSection: React.FC<TagGroupSectionProps> = ({
  selectedTags,
  onToggleTag
}) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const allTags = getAllTags();
  
  // Categorize tags for better organization
  const categoryTags = allTags.filter(tag => 
    ['Venture Capital', 'Private Equity', 'Real Estate', 'Mixed', 'Infrastructure', 'Debt'].includes(tag)
  );
  const investmentTags = allTags.filter(tag => 
    tag.includes('€') || tag.includes('Investment')
  );
  const riskTags = allTags.filter(tag => 
    ['Low Risk', 'Medium Risk', 'High Risk', 'Conservative', 'Aggressive'].includes(tag)
  );
  const otherTags = allTags.filter(tag => 
    !categoryTags.includes(tag) && !investmentTags.includes(tag) && !riskTags.includes(tag)
  );
  
  // Show first 6 tags initially, then show all when expanded
  const visibleTags = showAllTags ? allTags : allTags.slice(0, 6);
  const hasMoreTags = allTags.length > 6;

  const renderTagGroup = (title: string, tags: FundTag[], icon: React.ReactNode) => {
    if (tags.length === 0) return null;
    
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-primary/10 rounded-lg">
            {icon}
          </div>
          <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleTag(tag)}
              className={`${selectedTags.includes(tag) ? 
                "bg-primary hover:bg-primary/90 text-white shadow-md" : 
                "border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-800 hover:border-gray-400"} 
                text-xs px-3 py-2 h-auto min-h-[32px] rounded-full transition-all duration-200 
                hover:scale-105 hover:shadow-sm`}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px bg-gray-200 flex-1"></div>
        <span className="text-sm font-medium text-gray-500 px-3">All Filters</span>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      {!showAllTags ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {visibleTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleTag(tag)}
                className={`${selectedTags.includes(tag) ? 
                  "bg-primary hover:bg-primary/90 text-white shadow-md" : 
                  "border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-800 hover:border-gray-400"} 
                  text-xs px-3 py-2 h-auto min-h-[32px] rounded-full transition-all duration-200 
                  hover:scale-105 hover:shadow-sm`}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {renderTagGroup('Investment Categories', categoryTags, <Filter className="h-4 w-4 text-primary" />)}
          {renderTagGroup('Investment Amounts', investmentTags, <span className="text-primary font-bold text-sm">€</span>)}
          {renderTagGroup('Risk Levels', riskTags, <span className="text-primary font-bold text-xs">⚡</span>)}
          {renderTagGroup('Other Filters', otherTags, <span className="text-primary font-bold text-xs">•</span>)}
        </div>
      )}
      
      {hasMoreTags && (
        <Button
          variant="ghost"
          onClick={() => setShowAllTags(!showAllTags)}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 hover:bg-gray-50 
                   flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-dashed 
                   border-gray-200 hover:border-gray-300 transition-all duration-200"
        >
          {showAllTags ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less Filters
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show All Filters ({allTags.length - 6} more)
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default TagGroupSection;
