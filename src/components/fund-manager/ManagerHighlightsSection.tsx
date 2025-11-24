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
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-3xl font-semibold text-foreground">
            Key Highlights
          </h2>
        </div>
        
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
    </section>
  );
};

export default ManagerHighlightsSection;
