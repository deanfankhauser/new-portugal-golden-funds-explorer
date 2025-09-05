import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, TrendingUp, ArrowRight, Users, Briefcase } from 'lucide-react';

interface UnifiedAuthButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const UnifiedAuthButton: React.FC<UnifiedAuthButtonProps> = ({ 
  variant = 'default', 
  size = 'default',
  className = ''
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleManagerLogin = () => {
    setOpen(false);
    navigate('/manager-auth');
  };

  const handleInvestorLogin = () => {
    setOpen(false);
    navigate('/investor-auth');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Users className="mr-2 h-4 w-4" />
          Login / Register
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose your account type to continue
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Card 
            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-accent/5 border-2 hover:border-accent/20"
            onClick={handleInvestorLogin}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-lg">Investor Account</CardTitle>
              <CardDescription>
                Explore and research investment opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Access fund analysis</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-primary/5 border-2 hover:border-primary/20"
            onClick={handleManagerLogin}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Manager Account</CardTitle>
              <CardDescription>
                Manage your investment funds and portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Fund management tools</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Don't have an account? Registration is available on the next page
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedAuthButton;