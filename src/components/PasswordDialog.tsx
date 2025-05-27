
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { toast } from "@/hooks/use-toast";

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PasswordDialog: React.FC<PasswordDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { authenticate } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = authenticate(password);
    
    if (success) {
      toast({
        title: "Access granted",
        description: "Welcome! You now have full access to premium features.",
      });
      onOpenChange(false);
      setPassword('');
      onSuccess?.();
    } else {
      toast({
        title: "Access denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>MovingTo Client Access Required</DialogTitle>
          <DialogDescription>
            These premium features are exclusively available to MovingTo clients. Please enter your client password to access advanced search, filtering, and fund comparison tools.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter client password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="bg-[#EF4444] hover:bg-[#EF4444]/90"
            >
              {isLoading ? "Verifying..." : "Access Features"}
            </Button>
          </div>
        </form>
        
        <div className="text-center pt-4 border-t">
          <p className="text-xs text-gray-500 mb-2">
            Not a MovingTo client yet?
          </p>
          <a 
            href="https://movingto.io/contact" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#EF4444] hover:underline font-medium text-sm"
          >
            Contact MovingTo to become a client →
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
