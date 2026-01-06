import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Star, Sparkles } from 'lucide-react';

const PrimaryActionsStrip: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Compare Funds */}
            <ActionCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Compare Funds"
              description="See funds side-by-side on fees, risk, and liquidity"
              href="/compare"
              iconBg="bg-blue-500/10 text-blue-600"
            />

            {/* View Shortlist */}
            <ActionCard
              icon={<Star className="h-5 w-5" />}
              title="View Shortlist"
              description="Your saved funds, ready to explore"
              href="/saved-funds"
              iconBg="bg-amber-500/10 text-amber-600"
            />

            {/* Fund Matcher */}
            <ActionCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Find a Fund"
              description="Answer 6 questions, get matched funds"
              href="/fund-matcher"
              iconBg="bg-purple-500/10 text-purple-600"
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
  iconBg: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, href, iconBg }) => {
  return (
    <Link 
      to={href}
      className="group flex flex-col p-5 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-200"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${iconBg}`}>
        {icon}
      </div>
      
      <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
        {title}
        <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
      </h3>
      
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </Link>
  );
};

export default PrimaryActionsStrip;
