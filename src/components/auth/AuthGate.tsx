import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';

interface AuthGateProps {
  children: React.ReactNode;
  blur?: boolean;
  message?: string;
  height?: string;
}

const AuthGate: React.FC<AuthGateProps> = ({ 
  children, 
  blur = true, 
  message = "Sign in to unlock this content",
  height = "300px"
}) => {
  const navigate = useNavigate();
  const { user } = useEnhancedAuth();

  // GATED CONTENT DISABLED - All content now visible to everyone
  // To re-enable gating, uncomment the code below and remove the direct return
  
  return <>{children}</>;

  /* ORIGINAL GATING LOGIC - COMMENTED OUT FOR LATER RE-ACTIVATION
  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="relative" style={{ minHeight: height }}>
      {/* Blurred content *\/}
      <div className={blur ? "filter blur-sm pointer-events-none select-none" : "hidden"}>
        {children}
      </div>
      
      {/* Overlay *\/}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-background/60 via-background/80 to-background/60 backdrop-blur-sm">
        <div className="text-center space-y-4 px-6 py-8 bg-card/95 backdrop-blur-md rounded-xl border-2 border-primary/20 shadow-lg max-w-md">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Premium Content</h3>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <Button 
            onClick={() => navigate('/auth')}
            className="gap-2"
          >
            <Lock className="h-4 w-4" />
            Sign in to unlock
          </Button>
        </div>
      </div>
    </div>
  );
  */
};

export default AuthGate;
