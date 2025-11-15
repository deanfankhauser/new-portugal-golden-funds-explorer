import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth');
    onOpenChange(false);
  };

  const handleRegister = () => {
    navigate('/auth');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Authentication Required
          </DialogTitle>
          <DialogDescription className="text-center text-base leading-relaxed mt-4">
            Please log in or register to access this feature.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button onClick={handleLogin} className="gap-2">
            <LogIn className="h-4 w-4" />
            Log In
          </Button>
          
          <Button onClick={handleRegister} variant="outline" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Register as Manager
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground text-center mt-4">
          Already have an account? Choose "Log In" above.
        </p>
      </DialogContent>
    </Dialog>
  );
};