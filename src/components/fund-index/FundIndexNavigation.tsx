
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
    { id: 'top-five', label: 'Top 5 Funds', icon: Trophy },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'comparison', label: 'Compare', icon: BarChart3 },
    { id: 'full-index', label: 'Full Index', icon: Table },
    { id: 'methodology', label: 'Methodology', icon: Target }
  ];

  return (
    <div className="sticky top-4 z-10 mb-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-semibold text-gray-900">Quick Navigation</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection(item.id)}
              className="border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 
                         text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Navigate to any section instantly • Updated for 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundIndexNavigation;
