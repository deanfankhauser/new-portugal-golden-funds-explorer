import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrimaryActionsStrip: React.FC = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Compare Funds */}
            <ActionCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Compare Funds"
              description="See funds side-by-side on fees, risk, and liquidity"
              href="/compare"
              variant="primary"
            />

            {/* View Shortlist */}
            <ActionCard
              icon={<Star className="h-5 w-5" />}
              title="View Shortlist"
              description="Your saved funds, ready to explore"
              href="/saved-funds"
              variant="outline"
            />

            {/* Fund Matcher */}
            <ActionCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Find a Fund"
              description="Answer 6 questions, get matched funds"
              href="/fund-matcher"
              variant="outline"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  variant: 'primary' | 'outline';
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, href, variant }) => {
  return (
    <Link 
      to={href}
      className={`
        group flex flex-col p-6 rounded-xl border transition-all duration-200
        ${variant === 'primary' 
          ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' 
          : 'bg-card text-foreground border-border hover:border-primary/30 hover:shadow-md'
        }
      `}
    >
      <div className={`
        w-10 h-10 rounded-lg flex items-center justify-center mb-4
        ${variant === 'primary' 
          ? 'bg-primary-foreground/10' 
          : 'bg-primary/10 text-primary'
        }
      `}>
        {icon}
      </div>
      
      <h3 className="font-semibold mb-1 flex items-center gap-2">
        {title}
        <ArrowRight className={`
          h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all
          ${variant === 'primary' ? 'text-primary-foreground' : 'text-primary'}
        `} />
      </h3>
      
      <p className={`text-sm ${variant === 'primary' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
        {description}
      </p>
    </Link>
  );
};

export default PrimaryActionsStrip;
