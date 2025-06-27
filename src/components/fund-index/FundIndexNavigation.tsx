
import React from 'react';
import { Button } from '../ui/button';
import { TrendingUp, BarChart3, Table, Trophy, Target } from 'lucide-react';

const FundIndexNavigation: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { id: 'top-five', label: 'Top 5', icon: Trophy },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'comparison', label: 'Compare', icon: BarChart3 },
    { id: 'full-index', label: 'Full Index', icon: Table },
    { id: 'methodology', label: 'Methodology', icon: Target }
  ];

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection(item.id)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-md text-sm"
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FundIndexNavigation;
