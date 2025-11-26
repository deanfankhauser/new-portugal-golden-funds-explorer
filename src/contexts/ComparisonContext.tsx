
import React from 'react';
import { Fund } from '../data/types/funds';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { addTagsToFunds } from '@/data/services/funds-service';

interface ComparisonContextType {
  compareFunds: Fund[];
  addToComparison: (fund: Fund) => void;
  removeFromComparison: (fundId: string) => void;
  isInComparison: (fundId: string) => boolean;
  clearComparison: () => void;
  loadFundsFromIds: (fundIds: string[]) => Promise<void>;
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

  const loadFundsFromIds = async (fundIds: string[]) => {
    // Limit to 3 funds
    const ids = fundIds.slice(0, 3);
    
    try {
      const { data, error } = await supabase
        .from('funds')
        .select('*')
        .in('id', ids);

      if (error) throw error;

      if (data && data.length > 0) {
        // Transform to Fund type
        const transformedFunds: Fund[] = data.map((fund: any) => ({
          id: fund.id,
          name: fund.name,
          description: fund.description || '',
          detailedDescription: fund.detailed_description || '',
          managerName: fund.manager_name || '',
          minimumInvestment: Number(fund.minimum_investment) || 0,
          fundSize: Number(fund.aum) / 1000000 || 0,
          managementFee: fund.management_fee != null ? Number(fund.management_fee) : null,
          performanceFee: fund.performance_fee != null ? Number(fund.performance_fee) : null,
          term: Math.round((fund.lock_up_period_months || 0) / 12) || 5,
          returnTarget: `${fund.expected_return_min || 0}–${fund.expected_return_max || 0}% annually`,
          expectedReturnMin: fund.expected_return_min || undefined,
          expectedReturnMax: fund.expected_return_max || undefined,
          fundStatus: 'Open' as const,
          established: fund.inception_date ? new Date(fund.inception_date).getFullYear() : new Date().getFullYear(),
          regulatedBy: fund.regulated_by || undefined,
          location: fund.location || undefined,
          tags: (fund.tags || []),
          category: (fund.category || 'Other'),
          websiteUrl: fund.website || undefined,
          isVerified: fund.is_verified || false,
          riskBand: fund.risk_band || undefined,
          redemptionTerms: (() => {
            const rt = fund.redemption_terms;
            if (rt && typeof rt === 'object' && !Array.isArray(rt)) {
              const rtObj = rt as Record<string, any>;
              return {
                frequency: rtObj.frequency || 'End of Term',
                redemptionOpen: Boolean(rtObj.redemptionOpen ?? rtObj.redemption_open ?? true),
                noticePeriod: rtObj.noticePeriod ?? rtObj.notice_period,
                earlyRedemptionFee: rtObj.earlyRedemptionFee ?? rtObj.early_redemption_fee,
                minimumHoldingPeriod: rtObj.minimumHoldingPeriod ?? rtObj.minimum_holding_period,
                notes: rtObj.notes
              };
            }
            return undefined;
          })(),
        }));

        const fundsWithTags = addTagsToFunds(transformedFunds);
        setCompareFunds(fundsWithTags);
      }
    } catch (error) {
      console.error('Failed to load funds from IDs:', error);
      toast({
        title: "Failed to load comparison",
        description: "Could not load funds from the shared link.",
        variant: "destructive",
      });
    }
  };

  return (
    <ComparisonContext.Provider value={{ 
      compareFunds, 
      addToComparison, 
      removeFromComparison, 
      isInComparison,
      clearComparison,
      loadFundsFromIds
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
        clearComparison: () => {},
        loadFundsFromIds: async () => {}
      };
    }
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
};
