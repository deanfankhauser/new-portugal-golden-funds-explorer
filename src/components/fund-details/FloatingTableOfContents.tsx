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
    { id: 'risk-assessment', title: 'Risk Assessment', icon: '⚖️' },
    { id: 'fund-tabs', title: 'Fund Details', icon: '📄' },
    { id: 'related-funds', title: 'Similar Funds', icon: '🔗' },
    { id: 'alternatives', title: 'Alternatives', icon: '🔄' },
  ];

  // Show TOC only on mobile when user scrolls past header
  useEffect(() => {
    // Handle visibility based on scroll with minimal reflows
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const isMobile = window.innerWidth < 768;
      setIsVisible(isMobile && scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    // Use Intersection Observer for active section (no forced reflows)
    const observerOptions = {
      rootMargin: '-100px 0px -66% 0px',
      threshold: 0
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Use scrollIntoView to avoid getBoundingClientRect forced reflow
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      // Adjust for sticky header using scroll offset
      window.scrollBy({ top: -80, behavior: 'instant' });
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