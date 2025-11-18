import React, { useEffect } from 'react';
import { useManagerProfile } from '@/hooks/useManagerProfile';
import { Building2 } from 'lucide-react';

interface CompanyLogoProps {
  managerName: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-10 h-10 text-sm',
  md: 'w-14 h-14 text-base',
  lg: 'w-20 h-20 text-xl',
  xl: 'w-24 h-24 text-2xl',
};

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ 
  managerName, 
  size = 'md',
  className = '' 
}) => {
  const profile = useManagerProfile(managerName);
  
  // Debug logging
  useEffect(() => {
    console.log('🖼️ CompanyLogo Debug:', {
      managerName,
      profileFound: !!profile,
      profileData: profile,
      hasLogo: !!profile?.logo_url,
      logoUrl: profile?.logo_url
    });
  }, [managerName, profile]);
  
  // Get initials from company name for fallback
  const getInitials = (name: string) => {
    const words = name.split(' ').filter(word => 
      word.length > 0 && 
      !['SCR', 'S.A.', 'SA', 'LTD', 'LLC', 'INC'].includes(word.toUpperCase())
    );
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const sizeClass = sizeMap[size];
  const initials = getInitials(managerName);

  // Show logo if available, with proper error handling
  if (profile?.logo_url) {
    return (
      <div className={`${sizeClass} flex-shrink-0 ${className}`}>
        <img
          src={profile.logo_url}
          alt={`${managerName} logo`}
          className="w-full h-full object-cover rounded-lg border border-border/40 shadow-sm"
          onError={(e) => {
            console.error('❌ Logo failed to load:', profile.logo_url);
            // Replace with initials fallback
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-full h-full bg-accent/20 border-2 border-accent/50 rounded-lg flex items-center justify-center font-bold text-accent shadow-md">
                  ${initials}
                </div>
              `;
            }
          }}
        />
      </div>
    );
  }

  // If profile exists but no logo, or still loading - show initials immediately
  // Don't show indefinite loading state
  return (
    <div className={`${sizeClass} flex-shrink-0 ${className}`}>
      <div className="w-full h-full bg-accent/20 border-2 border-accent/50 rounded-lg flex items-center justify-center font-bold text-accent shadow-md">
        {initials}
      </div>
    </div>
  );
};
