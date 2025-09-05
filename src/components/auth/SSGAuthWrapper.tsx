import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SSGAuthWrapperProps {
  children: React.ReactNode;
}

const SSGAuthWrapper: React.FC<SSGAuthWrapperProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This only runs on the client side
    setIsClient(true);
  }, []);

  // During SSR or before client hydration, show loading state
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Portal</h1>
          <p className="text-muted-foreground mb-6">
            Preparing secure authentication interface...
          </p>
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Once on client side, render the actual auth component
  return <>{children}</>;
};

export default SSGAuthWrapper;