import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Menu, ChevronRight } from 'lucide-react';
import { Fund } from '../../data/types/funds';

interface FloatingTableOfContentsProps {
  fund: Fund;
}

const FloatingTableOfContents: React.FC<FloatingTableOfContentsProps> = ({ fund }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Table of contents sections
  const sections = [
    { id: 'decision-header', title: 'Fund Overview', icon: '📊' },
    { id: 'performance-module', title: 'Performance', icon: '📈' },
    { id: 'key-terms', title: 'Key Terms', icon: '📋' },
    { id: 'strategy-portfolio', title: 'Strategy & Portfolio', icon: '🎯' },
    { id: 'risk-assessment', title: 'Risk Assessment', icon: '⚖️' },
    { id: 'fund-tabs', title: 'Fund Details', icon: '📄' },
    { id: 'documents-disclosures', title: 'Documents', icon: '📁' },
    { id: 'related-funds', title: 'Similar Funds', icon: '🔗' },
    { id: 'alternatives', title: 'Alternatives', icon: '🔄' },
    { id: 'reviews', title: 'Reviews', icon: '⭐' },
  ];

  // Show TOC only on mobile when user scrolls past header
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;
      
      // Show after scrolling 300px on mobile only
      setIsVisible(isMobile && scrollY > 300);
      
      // Update active section based on scroll position
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // Account for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            size="sm" 
            className="rounded-full w-12 h-12 p-0 bg-primary/90 hover:bg-primary shadow-lg backdrop-blur-sm"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Menu className="h-5 w-5" />
              Navigate Fund Details
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium flex-1">{section.title}</span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </button>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Tap any section to jump directly to it
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FloatingTableOfContents;