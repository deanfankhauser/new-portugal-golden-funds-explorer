
import React from 'react';
import { Fund } from '../data/types/funds';
import { toast } from "@/components/ui/use-toast";

interface ComparisonContextType {
  compareFunds: Fund[];
  addToComparison: (fund: Fund) => void;
  removeFromComparison: (fundId: string) => void;
  isInComparison: (fundId: string) => boolean;
  clearComparison: () => void;
}

const ComparisonContext = React.createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareFunds, setCompareFunds] = React.useState<Fund[]>([]);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('compareFunds');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCompareFunds(parsed);
          }
        } catch (e) {
          console.error('Failed to parse stored comparison funds:', e);
        }
      }
    }
  }, []);

  // Persist to localStorage whenever compareFunds changes
  React.useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      if (compareFunds.length > 0) {
        localStorage.setItem('compareFunds', JSON.stringify(compareFunds));
      } else {
        localStorage.removeItem('compareFunds');
      }
    }
  }, [compareFunds, isHydrated]);

  const addToComparison = (fund: Fund) => {
    // Check if we already have this fund
    if (compareFunds.some(f => f.id === fund.id)) {
      return;
    }

    // Limit comparison to 3 funds
    if (compareFunds.length >= 3) {
      toast({
        title: "Comparison limit reached",
        description: "You can compare up to 3 funds at a time. Remove one to add another.",
        variant: "destructive",
      });
      return;
    }

    setCompareFunds([...compareFunds, fund]);
    toast({
      title: "Fund added to comparison",
      description: `${fund.name} has been added to your comparison list.`,
    });
  };

  const removeFromComparison = (fundId: string) => {
    setCompareFunds(compareFunds.filter(fund => fund.id !== fundId));
  };

  const isInComparison = (fundId: string) => {
    return compareFunds.some(fund => fund.id === fundId);
  };

  const clearComparison = () => {
    setCompareFunds([]);
  };

  return (
    <ComparisonContext.Provider value={{ 
      compareFunds, 
      addToComparison, 
      removeFromComparison, 
      isInComparison,
      clearComparison
    }}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = (): ComparisonContextType => {
  const context = React.useContext(ComparisonContext);
  
  // SSR-safe: Return empty state if no provider (during SSR)
  if (context === undefined) {
    if (typeof window === 'undefined') {
      // During SSR, return empty comparison
      return {
        compareFunds: [],
        addToComparison: () => {},
        removeFromComparison: () => {},
        isInComparison: () => false,
        clearComparison: () => {}
      };
    }
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
};
