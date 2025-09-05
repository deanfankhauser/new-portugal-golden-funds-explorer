import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ClientOnlyAuthProps {
  fallback: React.ComponentType;
  children: React.ReactNode;
}

const ClientOnlyAuth: React.FC<ClientOnlyAuthProps> = ({ fallback: Fallback, children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Fallback />;
  }

  return <>{children}</>;
};

export default ClientOnlyAuth;