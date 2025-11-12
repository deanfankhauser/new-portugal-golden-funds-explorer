import React from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSavedFunds } from '@/hooks/useSavedFunds';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { trackInteraction } from '@/utils/analyticsTracking';

interface SaveFundButtonProps {
  fundId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const SaveFundButton: React.FC<SaveFundButtonProps> = ({
  fundId,
  variant = 'ghost',
  size = 'sm',
  showText = false,
  className
}) => {
  // SSR-safe: Don't render during server-side rendering
  if (typeof window === 'undefined') return null;
  
  const { user } = useEnhancedAuth();
  const { toast } = useToast();
  const { isFundSaved, saveFund, unsaveFund } = useSavedFunds();
  const isSaved = isFundSaved(fundId);
  
  // Optimistic UI state for instant feedback
  const [optimisticSaved, setOptimisticSaved] = React.useState<boolean | null>(null);
  const displaySaved = optimisticSaved !== null ? optimisticSaved : isSaved;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: 'Please sign in to save funds',
        variant: 'destructive'
      });
      return;
    }

    // Optimistic update - instant feedback
    const newSavedState = !displaySaved;
    setOptimisticSaved(newSavedState);

    // Perform save/unsave in background
    if (displaySaved) {
      unsaveFund(fundId).then(success => {
        if (!success) {
          // Revert on failure
          setOptimisticSaved(!newSavedState);
        }
      });
    } else {
      saveFund(fundId).then(success => {
        if (success) {
          trackInteraction(fundId, 'save_fund');
        } else {
          // Revert on failure
          setOptimisticSaved(!newSavedState);
        }
      });
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-10 w-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  return (
    <Button
      variant={showText ? variant : undefined}
      size={showText ? 'sm' : 'icon'}
      onClick={handleClick}
      aria-pressed={displaySaved}
      title={displaySaved ? 'Remove from saved funds' : 'Save fund'}
      className={cn(
        showText ? 'gap-2' : getSizeClasses(),
        'transition-colors duration-200',
        displaySaved
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'border border-border hover:bg-primary hover:text-white',
        className
      )}
    >
      <Bookmark 
        className={getIconSize()}
        fill={displaySaved ? 'currentColor' : 'none'}
      />
      {showText && (
        <span>{displaySaved ? 'Saved' : 'Save'}</span>
      )}
    </Button>
  );
};