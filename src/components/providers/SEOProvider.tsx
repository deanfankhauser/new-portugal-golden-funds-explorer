
import React from 'react';
import { useRouteSEOOptimization } from '../../hooks/useRouteSEOOptimization';

interface SEOProviderProps {
  children: React.ReactNode;
}

const SEOProvider: React.FC<SEOProviderProps> = ({ children }) => {
  // Handle route-specific SEO logic
  useRouteSEOOptimization();
  
  return <>{children}</>;
};

export default SEOProvider;
