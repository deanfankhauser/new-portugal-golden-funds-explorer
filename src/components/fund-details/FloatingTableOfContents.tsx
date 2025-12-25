import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Menu, ChevronRight } from 'lucide-react';
import { Fund } from '../../data/types/funds';

interface FloatingTableOfContentsProps {
  fund: Fund;
}

const FloatingTableOfContents: React.FC<FloatingTableOfContentsProps> = ({ fund }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // SSR-safe: Don't render during server-side rendering
  if (typeof window === 'undefined') return null;

  // Table of contents sections
  const sections = [
    { id: 'fund-overview', title: 'Fund Overview', icon: '📊' },
    { id: 'key-terms-strategy', title: 'Key Terms', icon: '📋' },
    { id: 'financial-details', title: 'Financial Details', icon: '💰' },
    { id: 'fund-structure', title: 'Fund Structure', icon: '🏗️' },
    { id: 'team-information', title: 'Team Information', icon: '👥' },
    { id: 'enquiry-form', title: 'Get in Touch', icon: '✉️' },
  ];

  // Show TOC only on mobile when user scrolls past header
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth < 1024; // Changed from 768 to match lg breakpoint
      
      // Show after scrolling 300px on mobile only
      setIsVisible(isMobile && scrollY > 300);
      
      // Update active section based on scroll position with improved detection
      let currentSection = '';
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Section is active if it's in the top third of the viewport
          if (rect.top <= 150) {
            currentSection = section.id;
            break;
          }
        }
      }
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate offset accounting for fixed headers and padding
      const headerOffset = 100; // Offset for sticky headers and padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      // Smooth scroll with better performance
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Close the sheet after clicking
      setIsOpen(false);
      
      // Update active section immediately
      setActiveSection(sectionId);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            size="lg"
            className="rounded-full w-14 h-14 p-0 bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[85vw] max-w-sm">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-lg">
              <Menu className="h-5 w-5" />
              Navigate Sections
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary border-2 border-primary/30 shadow-sm scale-[1.02]'
                      : 'hover:bg-muted text-foreground border-2 border-transparent hover:border-border/50'
                  }`}
                  aria-label={`Navigate to ${section.title}`}
                  aria-current={isActive ? 'location' : undefined}
                >
                  <span className="text-xl">{section.icon}</span>
                  <span className="font-medium flex-1 text-[15px]">{section.title}</span>
                  <ChevronRight 
                    className={`h-5 w-5 transition-all duration-200 ${
                      isActive ? 'opacity-100 translate-x-0' : 'opacity-50 -translate-x-1'
                    }`} 
                  />
                </button>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Tap any section to jump directly to it.<br />Menu closes automatically.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FloatingTableOfContents;