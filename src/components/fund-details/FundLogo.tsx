import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface FundLogoProps {
  logoUrl?: string;
  fundName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const FundLogo: React.FC<FundLogoProps> = ({ 
  logoUrl, 
  fundName, 
  size = 'md', 
  className 
}) => {
  const [imageError, setImageError] = useState(false);

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
    <Avatar className={cn(sizeClasses[size], className)}>
      {logoUrl && !imageError && (
        <AvatarImage 
          src={logoUrl} 
          alt={`${fundName} logo`}
          onError={() => setImageError(true)}
          className="object-contain p-1"
        />
      )}
      <AvatarFallback className={cn(
        "bg-primary/10 text-primary font-semibold border-2 border-primary/20",
        textSizes[size]
      )}>
        {getInitials(fundName)}
      </AvatarFallback>
    </Avatar>
  );
};

export default FundLogo;