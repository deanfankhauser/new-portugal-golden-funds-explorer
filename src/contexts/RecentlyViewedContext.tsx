
import React from 'react';
import { Fund } from '../data/types/funds';

interface RecentlyViewedContextType {
  recentlyViewed: Fund[];
  addToRecentlyViewed: (fund: Fund) => void;
}

const RecentlyViewedContext = React.createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // SSG-safe: Don't access localStorage during SSG
  const isSSG = typeof window === 'undefined';
  const [recentlyViewed, setRecentlyViewed] = React.useState<Fund[]>([]);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Load from localStorage only after hydration (skip during SSG)
  React.useEffect(() => {
    setIsHydrated(true);
    if (!isSSG) {
      const stored = localStorage.getItem('recentlyViewedFunds');
      if (stored) {
        try {
          setRecentlyViewed(JSON.parse(stored));
        } catch (error) {
          console.error('Error parsing recently viewed funds:', error);
        }
      }
    }
  }, [isSSG]);

  // Save to localStorage whenever recentlyViewed changes (skip during SSG)
  React.useEffect(() => {
    if (!isSSG && isHydrated) {
      localStorage.setItem('recentlyViewedFunds', JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, isHydrated, isSSG]);

  const addToRecentlyViewed = (fund: Fund) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(f => f.id !== fund.id);
      // Add to beginning and limit to 5 items
      return [fund, ...filtered].slice(0, 5);
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = React.useContext(RecentlyViewedContext);
  
  // SSR-safe: Return empty state if no provider (during SSR)
  if (context === undefined) {
    if (typeof window === 'undefined') {
      // During SSR, return empty recently viewed
      return {
        recentlyViewed: [],
        addToRecentlyViewed: () => {}
      };
    }
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};
