import React from 'react';
import { cn } from '@/lib/utils';

interface StandardCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

/**
 * StandardCard - A reusable card component following the design system
 * 
 * Design tokens:
 * - Background: bg-card
 * - Border: border-border (rounded-xl)
 * - Padding: p-6 (sm), p-8 (md - default), p-12 (lg)
 * - Hover: hover:border-primary/20 hover:shadow-lg transition-all duration-300
 * 
 * Based on profile page design language.
 */
const StandardCard: React.FC<StandardCardProps> = ({ 
  children, 
  className,
  hover = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    sm: 'p-6',
    md: 'p-8',
    lg: 'p-12'
  };

  return (
    <div 
      className={cn(
        'bg-card rounded-xl border border-border',
        paddingClasses[padding],
        hover && 'hover:border-primary/20 hover:shadow-lg transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
};

export default StandardCard;
