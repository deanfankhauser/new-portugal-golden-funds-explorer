import React from 'react';
import { Fund } from '../data/types/funds';
import { toast } from "@/hooks/use-toast";

interface ShortlistContextType {
  shortlistedFunds: Fund[];
  addToShortlist: (fund: Fund) => void;
  removeFromShortlist: (fundId: string) => void;
  isInShortlist: (fundId: string) => boolean;
  clearShortlist: () => void;
}

const ShortlistContext = React.createContext<ShortlistContextType | undefined>(undefined);

export const ShortlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shortlistedFunds, setShortlistedFunds] = React.useState<Fund[]>([]);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Load from localStorage only after hydration
  React.useEffect(() => {
    setIsHydrated(true);
    const stored = localStorage.getItem('shortlistedFunds');
    if (stored) {
      try {
        setShortlistedFunds(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing shortlisted funds:', error);
      }
    }
  }, []);

  // Save to localStorage whenever shortlist changes (but only after hydration)
  React.useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('shortlistedFunds', JSON.stringify(shortlistedFunds));
    }
  }, [shortlistedFunds, isHydrated]);

  const addToShortlist = (fund: Fund) => {
    // Check if we already have this fund
    if (shortlistedFunds.some(f => f.id === fund.id)) {
      return;
    }

    setShortlistedFunds([...shortlistedFunds, fund]);
    toast({
      title: "Fund added to shortlist",
      description: `${fund.name} has been added to your shortlist.`,
    });
  };

  const removeFromShortlist = (fundId: string) => {
    const fund = shortlistedFunds.find(f => f.id === fundId);
    setShortlistedFunds(shortlistedFunds.filter(f => f.id !== fundId));
    
    if (fund) {
      toast({
        title: "Fund removed from shortlist",
        description: `${fund.name} has been removed from your shortlist.`,
        variant: "destructive",
      });
    }
  };

  const isInShortlist = (fundId: string) => {
    return shortlistedFunds.some(fund => fund.id === fundId);
  };

  const clearShortlist = () => {
    setShortlistedFunds([]);
    toast({
      title: "Shortlist cleared",
      description: "All funds have been removed from your shortlist.",
    });
  };

  return (
    <ShortlistContext.Provider value={{ 
      shortlistedFunds, 
      addToShortlist, 
      removeFromShortlist, 
      isInShortlist,
      clearShortlist
    }}>
      {children}
    </ShortlistContext.Provider>
  );
};

export const useShortlist = (): ShortlistContextType => {
  const context = React.useContext(ShortlistContext);
  
  // SSR-safe: Return empty state if no provider (during SSR)
  if (context === undefined) {
    if (typeof window === 'undefined') {
      // During SSR, return empty shortlist
      return {
        shortlistedFunds: [],
        addToShortlist: () => {},
        removeFromShortlist: () => {},
        isInShortlist: () => false,
        clearShortlist: () => {}
      };
    }
    throw new Error("useShortlist must be used within a ShortlistProvider");
  }
  return context;
};