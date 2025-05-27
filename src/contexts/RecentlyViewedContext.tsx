
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Fund } from '../data/types/funds';

interface RecentlyViewedContextType {
  recentlyViewed: Fund[];
  addToRecentlyViewed: (fund: Fund) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Fund[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewedFunds');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing recently viewed funds:', error);
      }
    }
  }, []);

  // Save to localStorage whenever recentlyViewed changes
  useEffect(() => {
    localStorage.setItem('recentlyViewedFunds', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

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
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};
