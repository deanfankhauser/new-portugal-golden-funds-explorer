import React from 'react';
import { Award, TrendingUp, Shield, Target, Sparkles } from 'lucide-react';

interface Highlight {
  title: string;
  description: string;
  icon?: 'award' | 'trending' | 'shield' | 'target';
}

interface ManagerHighlightsSectionProps {
  managerName: string;
  highlights: Highlight[];
}

const ManagerHighlightsSection: React.FC<ManagerHighlightsSectionProps> = ({ 
  managerName, 
  highlights 
}) => {
  const getIcon = (iconType?: string) => {
    const iconClass = "h-6 w-6";
    switch (iconType) {
      case 'award':
        return <Award className={iconClass} />;
      case 'trending':
        return <TrendingUp className={iconClass} />;
      case 'shield':
        return <Shield className={iconClass} />;
      case 'target':
        return <Target className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-foreground mb-12">
        Key Highlights
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {highlights.map((highlight, index) => (
          <div 
            key={index} 
            className="group relative bg-card rounded-xl border border-border p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                {getIcon(highlight.icon)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-xl mb-3">
                  {highlight.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerHighlightsSection;
