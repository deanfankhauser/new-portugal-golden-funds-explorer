import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, TrendingUp } from 'lucide-react';

const UniversalAuthButton = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setShowDialog(true)}
        variant="outline" 
        className="border-background bg-background text-foreground hover:bg-secondary hover:text-foreground transition-all duration-300"
      >
        Login / Register
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose your account type</DialogTitle>
            <DialogDescription>
              Select whether you're an investor or a fund manager to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <Link to="/investor-auth" onClick={() => setShowDialog(false)}>
              <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    <TrendingUp className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Investor</CardTitle>
                  <CardDescription>
                    Access investment opportunities and manage your portfolio
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            
            <Link to="/manager-auth" onClick={() => setShowDialog(false)}>
              <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    <Building className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Fund Manager</CardTitle>
                  <CardDescription>
                    Manage your funds and connect with investors
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UniversalAuthButton;