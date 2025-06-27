
import React from 'react';
import { Button } from '../ui/button';
import { TrendingUp, BarChart3, Table, Trophy, Target, Zap } from 'lucide-react';

const FundIndexNavigation: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { id: 'top-five', label: 'Top 5 Funds', icon: Trophy, color: 'from-amber-500 to-orange-500' },
    { id: 'performance', label: 'Performance', icon: TrendingUp, color: 'from-blue-500 to-indigo-500' },
    { id: 'comparison', label: 'Compare', icon: BarChart3, color: 'from-emerald-500 to-teal-500' },
    { id: 'full-index', label: 'Full Index', icon: Table, color: 'from-purple-500 to-violet-500' },
    { id: 'methodology', label: 'Methodology', icon: Target, color: 'from-pink-500 to-rose-500' }
  ];

  return (
    <div className="sticky top-4 z-10 mb-8">
      <div className="bg-white/95 backdrop-blur-md border-2 border-gray-200 rounded-2xl shadow-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900">Quick Navigation</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection(item.id)}
              className="group relative overflow-hidden border border-gray-200 hover:border-gray-300 
                         bg-white hover:bg-gray-50 transition-all duration-300 rounded-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 
                              group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative flex items-center gap-2">
                <item.icon className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {item.label}
                </span>
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
