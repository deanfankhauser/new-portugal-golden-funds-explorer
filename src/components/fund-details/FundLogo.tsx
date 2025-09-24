import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useFundEditing } from '@/hooks/useFundEditing';

interface FundLogoProps {
  logoUrl?: string;
  fundName: string;
  fundId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const FundLogo: React.FC<FundLogoProps> = ({ 
  logoUrl, 
  fundName, 
  fundId,
  size = 'md', 
  className 
}) => {
  const { getPendingChangesForFund, updatePendingChanges } = useFundEditing();
  const [imageError, setImageError] = useState(false);
  
  // Check for pending logo changes
  const pendingChanges = fundId ? getPendingChangesForFund(fundId) : {};
  const effectiveLogoUrl = pendingChanges.logoUrl !== undefined ? pendingChanges.logoUrl : logoUrl;

  // Get fund initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Size mappings
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className="relative">
      <Avatar className={cn(sizeClasses[size], "rounded-full overflow-hidden", className)}>
        {effectiveLogoUrl && !imageError && (
          <AvatarImage 
            src={effectiveLogoUrl} 
            alt={`${fundName} logo`}
            onError={() => {
              setImageError(true);
              // If this is a pending change and it fails to load, clean it up
              if (fundId && pendingChanges.logoUrl !== undefined && effectiveLogoUrl === pendingChanges.logoUrl) {
                console.warn('Cleaning up broken pending logo URL:', effectiveLogoUrl);
                // Remove the broken logoUrl from pending changes
                const currentPending = fundId ? getPendingChangesForFund(fundId) : {};
                const { logoUrl, ...otherChanges } = currentPending;
                updatePendingChanges(fundId, otherChanges);
              }
            }}
            className="object-cover w-full h-full"
          />
        )}
        <AvatarFallback className={cn(
          "bg-primary/10 text-primary font-semibold border-2 border-primary/20",
          textSizes[size]
        )}>
          {getInitials(fundName)}
        </AvatarFallback>
      </Avatar>
      {/* Show pending indicator if there are changes */}
      {pendingChanges.logoUrl !== undefined && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-background" 
             title="Logo change pending approval" />
      )}
    </div>
  );
};

export default FundLogo;