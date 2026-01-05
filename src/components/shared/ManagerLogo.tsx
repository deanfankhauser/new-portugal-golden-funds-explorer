import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ManagerLogoProps {
  logoUrl?: string | null;
  managerName: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showInitialsFallback?: boolean;
}

const sizeConfig = {
  xs: { container: 'w-8 h-8', icon: 'h-4 w-4', text: 'text-xs' },
  sm: { container: 'w-10 h-10', icon: 'h-5 w-5', text: 'text-sm' },
  md: { container: 'w-12 h-12', icon: 'h-6 w-6', text: 'text-base' },
  lg: { container: 'w-16 h-16', icon: 'h-8 w-8', text: 'text-lg' },
  xl: { container: 'w-20 h-20', icon: 'h-10 w-10', text: 'text-xl' },
};

const getInitials = (name: string): string => {
  return name
    .split(/[\s-]+/)
    .filter(word => word.length > 0)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
};

export const ManagerLogo: React.FC<ManagerLogoProps> = ({
  logoUrl,
  managerName,
  size = 'md',
  className,
  showInitialsFallback = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const config = sizeConfig[size];
  const initials = getInitials(managerName);

  const handleImageError = () => {
    setImageError(true);
  };

  // Show logo if URL exists and hasn't errored
  if (logoUrl && !imageError) {
    return (
      <img
        src={logoUrl}
        alt={`${managerName} logo`}
        className={cn(
          config.container,
          'rounded-lg object-contain bg-muted',
          className
        )}
        onError={handleImageError}
      />
    );
  }

  // Fallback: initials or icon
  return (
    <div
      className={cn(
        config.container,
        'rounded-lg bg-muted flex items-center justify-center',
        className
      )}
    >
      {showInitialsFallback && initials ? (
        <span className={cn(config.text, 'font-medium text-muted-foreground')}>
          {initials}
        </span>
      ) : (
        <Building2 className={cn(config.icon, 'text-muted-foreground')} />
      )}
    </div>
  );
};

export default ManagerLogo;
