import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const UniversalAuthButton = () => {
  const navigate = useNavigate();

  return (
    <Button 
      onClick={() => navigate('/auth')}
      variant="outline" 
      className="border-background bg-background text-foreground hover:bg-secondary hover:text-foreground transition-all duration-300"
    >
      Login / Register
    </Button>
  );
};

export default UniversalAuthButton;