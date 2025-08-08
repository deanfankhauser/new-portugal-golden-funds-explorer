
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
import { Lock, Star, TrendingUp, FileText, Calculator } from 'lucide-react';

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

  // Simple analytics tracking
  const trackUnlockAttempt = (action: string, context?: string) => {
    // Analytics tracking for unlock attempt
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    trackUnlockAttempt('password_submit');

    const success = authenticate(password);
    
    if (success) {
      trackUnlockAttempt('authentication_success');
      toast({
        title: "Access granted",
        description: "Welcome! You now have full access to premium features.",
      });
      onOpenChange(false);
      setPassword('');
      onSuccess?.();
    } else {
      trackUnlockAttempt('authentication_failed');
      toast({
        title: "Access denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleConsultationClick = () => {
    trackUnlockAttempt('consultation_cta_click');
  };

  const handleDialogOpen = (open: boolean) => {
    if (open) {
      trackUnlockAttempt('dialog_opened');
    }
    onOpenChange(open);
  };

  const premiumFeatures = [
    { icon: FileText, title: "Detailed Fee Analysis", description: "Management, performance & hidden fees" },
    { icon: TrendingUp, title: "Advanced Fund Comparison", description: "Side-by-side analysis of all metrics" },
    { icon: Calculator, title: "ROI Calculator", description: "Personalized return projections" },
    { icon: Star, title: "Due Diligence Documents", description: "Prospectus, audits & legal docs" }
  ];

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogContent 
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        data-analytics="unlock-premium-dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="w-5 h-5 text-[#EF4444]" />
            Exclusive Client Access Required
          </DialogTitle>
          <DialogDescription className="text-base">
            These premium features are exclusively available to MovingTo clients who receive our comprehensive Golden Visa advisory services.
          </DialogDescription>
        </DialogHeader>
        
        {/* Premium Features Preview */}
        <div className="my-6">
          <h3 className="font-semibold text-gray-900 mb-4">🔒 What you're missing:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border">
                <feature.icon className="w-5 h-5 text-[#EF4444] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm text-gray-900">{feature.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency Message */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-900 text-sm">Limited Access</h4>
              <p className="text-sm text-amber-800 mt-1">
                Only active MovingTo clients have access to these detailed fund analytics and comparison tools used by our advisory team.
              </p>
            </div>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter your client access password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              autoFocus
              data-analytics="password-input"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-analytics="cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="bg-[#EF4444] hover:bg-[#EF4444]/90 flex-1"
              data-analytics="access-premium-button"
            >
              {isLoading ? "Verifying..." : "Access Premium Features"}
            </Button>
          </div>
        </form>
        
        {/* Prominent CTA */}
        <div className="text-center pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-[#EF4444]/10 to-[#EF4444]/5 p-6 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-2">Not a MovingTo client yet?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get personalized Golden Visa guidance plus full access to our premium fund analysis tools.
            </p>
            <a 
              href="https://movingto.com/contact" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleConsultationClick}
              className="inline-flex items-center justify-center bg-[#EF4444] hover:bg-[#EF4444]/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              data-analytics="consultation-cta"
            >
              Book Free Consultation →
            </a>
            <p className="text-xs text-gray-500 mt-3">
              🚀 Get instant access to premium features when you become a client
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
