import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Percent, TrendingUp, CreditCard, LogOut, DollarSign } from 'lucide-react';

interface FeeTypeCardProps {
  slug: string;
  title: string;
  description: string;
  fundsCount?: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'management-fee': Percent,
  'performance-fee': TrendingUp,
  'subscription-fee': CreditCard,
  'redemption-fee': LogOut,
  'exit-fee': LogOut,
  'total-cost': DollarSign
};

export const FeeTypeCard: React.FC<FeeTypeCardProps> = ({ 
  slug, 
  title, 
  description,
  fundsCount 
}) => {
  const Icon = iconMap[slug] || DollarSign;
  const href = slug === 'total-cost' ? '#estimator' : `/fees/${slug}`;
  const isAnchor = slug === 'total-cost';
  
  const content = (
    <Card className="group h-full border border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
            {fundsCount !== undefined && fundsCount > 0 && (
              <p className="text-xs text-muted-foreground/80 mt-2">
                {fundsCount} funds with disclosed data
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  if (isAnchor) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }
  
  return (
    <Link to={href} className="block">
      {content}
    </Link>
  );
};

export default FeeTypeCard;
