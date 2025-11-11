import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3 } from 'lucide-react';
import { useFundEditing } from '@/hooks/useFundEditing';
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
  const { isAuthenticated, isHydrated, checkHydration, canEditFund } = useFundEditing();
  const [showEditModal, setShowEditModal] = useState(false);
  const [canDirectEdit, setCanDirectEdit] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(false);

  useEffect(() => {
    checkHydration();
  }, [checkHydration]);

  useEffect(() => {
    const checkPermission = async () => {
      if (!isAuthenticated || !isHydrated) {
        setCanDirectEdit(false);
        return;
      }

      setCheckingPermission(true);
      try {
        const canEdit = await canEditFund(fund.id);
        setCanDirectEdit(canEdit);
      } catch (error) {
        console.error('Error checking edit permission:', error);
        setCanDirectEdit(false);
      } finally {
        setCheckingPermission(false);
      }
    };

    checkPermission();
  }, [isAuthenticated, isHydrated, fund.id, canEditFund]);

  // Only show button for authenticated users with edit permission
  if (!isHydrated || !isAuthenticated || !canDirectEdit) {
    return null;
  }

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const buttonText = checkingPermission ? 'Loading...' : 'Edit Fund';

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleEditClick}
        disabled={checkingPermission}
        className={`gap-2 ${className}`}
      >
        <Edit3 className="h-4 w-4" />
        <span>{buttonText}</span>
      </Button>

      <FundEditModal
        fund={fund}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />
    </>
  );
};