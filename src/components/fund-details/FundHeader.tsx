
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fund } from '../../data/funds';
import { Button } from "@/components/ui/button";
import { GitCompare } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { useAuth } from '../../contexts/AuthContext';
import { tagToSlug } from '@/lib/utils';
import IntroductionButton from './IntroductionButton';
import PasswordDialog from '../PasswordDialog';

interface FundHeaderProps {
  fund: Fund;
}

const FundHeader: React.FC<FundHeaderProps> = ({ fund }) => {
  const navigate = useNavigate();
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  const isSelected = isInComparison(fund.id);
  
  const handleCompareClick = () => {
    if (!isAuthenticated) {
      setShowPasswordDialog(true);
      return;
    }
    
    if (isSelected) {
      removeFromComparison(fund.id);
    } else {
      addToComparison(fund);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-8 md:p-10 border-b border-gray-100">
        <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 tracking-tight">{fund.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant={isSelected ? "default" : "outline"}
              className={isSelected ? 
                "bg-[#EF4444] text-white hover:bg-[#EF4444]/90 shadow-sm" : 
                "border-[#EF4444] text-[#EF4444] hover:bg-[#f0f0f0] hover:text-[#EF4444] shadow-sm"}
              onClick={handleCompareClick}
            >
              <GitCompare className="mr-2 h-4 w-4" />
              {isSelected ? 'Added to Compare' : 'Compare'}
            </Button>
            <IntroductionButton variant="compact" />
          </div>
        </div>

        <p className="text-xl text-gray-700 mb-8 max-w-3xl leading-relaxed">{fund.description}</p>

        <div className="flex flex-wrap gap-2">
          {fund.tags.map(tag => (
            <Link 
              key={tag} 
              to={`/tags/${tagToSlug(tag)}`}
              className="bg-white/80 hover:bg-[#EF4444] hover:text-white text-[#EF4444] border border-[#EF4444] px-3 py-1 rounded-full transition-all duration-300 shadow-sm text-sm font-medium"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      <PasswordDialog 
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </>
  );
};

export default FundHeader;
