import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3 } from 'lucide-react';
import { useFundEditing } from '@/hooks/useFundEditing';
import { AuthRequiredModal } from './AuthRequiredModal';
import { FundEditModal } from './FundEditModal';
import { Fund } from '@/data/funds';

interface FundEditButtonProps {
  fund: Fund;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const FundEditButton: React.FC<FundEditButtonProps> = ({
  fund,
  variant = 'outline',
  size = 'sm',
  className = ''
}) => {
  const { isAuthenticated, isHydrated, checkHydration } = useFundEditing();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    checkHydration();
  }, [checkHydration]);

  const handleEditClick = () => {
    if (!isHydrated) {
      // During SSG build or before hydration, do nothing
      return;
    }

    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowEditModal(true);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleEditClick}
        disabled={!isHydrated}
        className={`gap-2 ${className}`}
      >
        <Edit3 className="h-4 w-4" />
        <span className="hidden sm:inline">
          {isHydrated ? 'Edit Fund Info' : 'Loading...'}
        </span>
        <span className="sm:hidden">Edit</span>
      </Button>

      <AuthRequiredModal 
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />

      <FundEditModal
        fund={fund}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />
    </>
  );
};