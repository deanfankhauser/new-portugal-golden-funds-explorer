
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Search } from 'lucide-react';
import { FundTag } from '../../data/funds';

interface EmptyFundsStateProps {
  setSelectedTags: (tags: FundTag[]) => void;
  setSearchQuery: (query: string) => void;
}

const EmptyFundsState: React.FC<EmptyFundsStateProps> = ({
  setSelectedTags,
  setSearchQuery
}) => {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm border p-8 card-hover-effect">
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center 
                       justify-center mx-auto interactive-hover">
          <Search className="h-10 w-10 text-gray-400" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3 text-high-contrast">
            No funds match your criteria
          </h3>
          <p className="text-medium-contrast mb-6 leading-relaxed">
            Try adjusting your search or take our quiz for personalized recommendations
          </p>
        </div>
        <div className="space-y-3">
          <Link to="/fund-quiz">
            <Button className="w-full btn-primary-enhanced text-base h-12 font-medium"
                    aria-label="Take quiz for fund recommendations">
              <ClipboardCheck className="mr-2 h-5 w-5" aria-hidden="true" />
              Get Personalized Recommendations
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full text-base h-12 font-medium btn-secondary-enhanced"
            onClick={() => {
              setSelectedTags([]);
              setSearchQuery('');
            }}
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyFundsState;
