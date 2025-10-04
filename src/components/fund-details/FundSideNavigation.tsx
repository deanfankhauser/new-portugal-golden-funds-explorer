import React from 'react';
import { FileText, PieChart, Users, Target, DollarSign, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FundSideNavigationProps {
  className?: string;
}

const FundSideNavigation: React.FC<FundSideNavigationProps> = ({ className = '' }) => {
  // SSR-safe: Don't render during server-side rendering (requires DOM APIs)
  if (typeof window === 'undefined') return null;
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { id: 'fund-overview', label: 'Overview', icon: FileText },
    { id: 'key-terms-strategy', label: 'Key Terms', icon: Target },
    { id: 'financial-details', label: 'Financial Details', icon: DollarSign },
    { id: 'fund-structure', label: 'Fund Structure', icon: PieChart },
    { id: 'team-information', label: 'Team', icon: Users },
  ];

  return (
    <div className={`xl:sticky xl:top-24 bg-card border border-border rounded-lg p-4 space-y-2 mb-6 xl:mb-0 ${className}`}>
      <h3 className="text-sm font-semibold text-foreground mb-3">Quick Navigation</h3>
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          size="sm"
          onClick={() => scrollToSection(item.id)}
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted text-xs"
        >
          <item.icon className="w-3 h-3 mr-2" />
          {item.label}
        </Button>
      ))}
    </div>
  );
};

export default FundSideNavigation;