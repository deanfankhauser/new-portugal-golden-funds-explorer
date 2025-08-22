
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../contexts/ComparisonContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GitCompare } from 'lucide-react';
import LazyPasswordDialog from './common/LazyPasswordDialog';

const ComparisonIndicator = () => {
  const navigate = useNavigate();
  const { compareFunds } = useComparison();
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const count = compareFunds.length;

  if (count === 0) {
    return null;
  }

  const handleCompareClick = () => {
    if (isAuthenticated) {
      navigate('/compare');
    } else {
      setShowPasswordDialog(true);
    }
  };

  const handleAuthSuccess = () => {
    navigate('/compare');
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleCompareClick}
      >
        <GitCompare className="mr-2 h-4 w-4" />
        <span>Compare ({count})</span>
      </Button>

      <LazyPasswordDialog 
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default ComparisonIndicator;
