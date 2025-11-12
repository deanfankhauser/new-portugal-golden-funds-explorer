import React from 'react';
import { Button } from '@/components/ui/button';

interface HeaderIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  badgeCount?: number;
}

/**
 * Reusable header icon button with consistent default, hover and active states.
 * - Default: transparent bg, text-background icon
 * - Hover: bg-background/10
 * - Active: bg-background/20
 * - Focus: standard ring
 * - Optional badge in top-right
 */
export const HeaderIconButton: React.FC<HeaderIconButtonProps> = ({
  ariaLabel,
  badgeCount,
  className,
  children,
  ...props
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={ariaLabel}
      className={
        [
          'relative text-background',
          'hover:bg-background/10 active:bg-background/20',
          'transition-colors',
          className,
        ].filter(Boolean).join(' ')
      }
      {...props}
   >
      {children}
      {typeof badgeCount === 'number' && badgeCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {badgeCount}
        </span>
      )}
    </Button>
  );
};

export default HeaderIconButton;
