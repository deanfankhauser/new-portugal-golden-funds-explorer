
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fund } from '../../data/funds';
import { Button } from "@/components/ui/button";
import { GitCompare } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { tagToSlug } from '@/lib/utils';

interface FundHeaderProps {
  fund: Fund;
}

const FundHeader: React.FC<FundHeaderProps> = ({ fund }) => {
  const navigate = useNavigate();
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  
  const isSelected = isInComparison(fund.id);
  
  const handleCompareClick = () => {
    if (isSelected) {
      removeFromComparison(fund.id);
    } else {
      addToComparison(fund);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2] p-8 md:p-10">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-0 text-gray-800">{fund.name}</h1>
        <Button 
          variant={isSelected ? "default" : "outline"}
          className={isSelected ? 
            "bg-[#EF4444] text-white hover:bg-[#EF4444]/90" : 
            "border-[#EF4444] text-[#EF4444] hover:bg-[#f0f0f0] hover:text-[#EF4444]"}
          onClick={handleCompareClick}
        >
          <GitCompare className="mr-2 h-4 w-4" />
          {isSelected ? 'Added to Compare' : 'Compare'}
        </Button>
      </div>

      <p className="text-xl text-gray-700 mb-8 max-w-3xl">{fund.description}</p>

      <div className="flex flex-wrap gap-2">
        {fund.tags.map(tag => (
          <Link 
            key={tag} 
            to={`/tags/${tagToSlug(tag)}`}
            className="bg-white hover:bg-[#EF4444] hover:text-white text-[#EF4444] border border-[#EF4444] px-3 py-1 rounded-full transition-colors shadow-sm"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FundHeader;
