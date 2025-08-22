
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardCheck } from 'lucide-react';

const MobileFundQuizCTA: React.FC = () => {
  return (
    <div className="lg:hidden mt-8">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-xl 
                     border border-primary/20 shadow-sm card-hover-effect">
        <div className="text-center space-y-4">
          <div className="bg-primary/20 p-3 rounded-lg inline-flex interactive-hover">
            <ClipboardCheck className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2 text-lg text-high-contrast">
              Find Your Ideal Fund
            </h3>
            <p className="text-sm text-muted-foreground mb-4 text-medium-contrast">
              Get personalized recommendations in under 2 minutes
            </p>
          </div>
          <Link to="/fund-quiz" className="block">
            <Button className="w-full btn-primary-enhanced text-base h-12 font-medium transition-smooth"
                    aria-label="Take fund quiz for personalized recommendations">
              <ClipboardCheck className="mr-2 h-5 w-5" aria-hidden="true" />
              Take Fund Quiz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileFundQuizCTA;
