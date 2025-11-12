import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSavedFunds } from '../hooks/useSavedFunds';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';

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
    <Button
      variant="ghost"
      size="icon"
      className="bg-transparent text-background hover:bg-background/10 hover:!text-background relative"
      onClick={handleSavedClick}
      aria-label={`Saved funds (${count})`}
    >
      <Bookmark className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </Button>
  );
};

export default SavedFundsIndicator;
