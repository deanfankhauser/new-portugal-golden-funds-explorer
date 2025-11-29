import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSavedFunds } from '../hooks/useSavedFunds';
import { Star } from 'lucide-react';
import HeaderIconButton from '@/components/common/HeaderIconButton';

const SavedFundsIndicator = () => {
  const navigate = useNavigate();
  const { savedFunds } = useSavedFunds();
  const count = savedFunds.length;

  // SSR-safe: Don't render during server-side rendering
  if (typeof window === 'undefined') return null;

  const handleSavedClick = () => {
    navigate('/saved-funds');
  };

  return (
    <HeaderIconButton
      onClick={handleSavedClick}
      ariaLabel={`Watchlist (${count})`}
      badgeCount={count}
    >
      <Star className="h-5 w-5" />
    </HeaderIconButton>
  );
};

export default SavedFundsIndicator;
