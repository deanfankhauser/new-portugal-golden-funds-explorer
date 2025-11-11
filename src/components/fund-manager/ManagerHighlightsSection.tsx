import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, TrendingUp, Shield, Target } from 'lucide-react';

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
    const iconClass = "h-6 w-6 text-primary";
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
        return <Award className={iconClass} />;
    }
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Key Highlights & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="flex gap-4 p-5 rounded-lg border border-border bg-gradient-to-br from-card to-muted/20 hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 mt-1">
                {getIcon(highlight.icon)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-2">
                  {highlight.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerHighlightsSection;
