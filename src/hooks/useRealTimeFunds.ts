import { useState, useEffect } from 'react';
import { Fund, FundTag } from '../data/types/funds';
import { funds as staticFunds } from '../data/funds'; // Fallback to static data

export const useRealTimeFunds = () => {
  const [funds, setFunds] = useState<Fund[]>(staticFunds);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For now, use static funds until Supabase types are properly generated
    // This will be updated once the database migration is complete
    console.log('🔄 Using static funds data (real-time coming soon)');
    setFunds(staticFunds);
    setLoading(false);
  }, []);

  const filterFunds = (tags: FundTag[], searchQuery: string) => {
    let result = [...funds];
    
    // Apply tag filtering
    if (tags.length > 0) {
      result = result.filter(fund => 
        tags.every(tag => fund.tags.includes(tag))
      );
    }
    
    // Apply search filtering
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(fund => 
        fund.name.toLowerCase().includes(lowerCaseQuery) ||
        fund.description.toLowerCase().includes(lowerCaseQuery) ||
        fund.managerName.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    return result;
  };

  const getFundById = (id: string): Fund | undefined => {
    return funds.find(fund => fund.id === id);
  };

  const getFundsByManager = (managerName: string): Fund[] => {
    return funds.filter(fund => fund.managerName === managerName);
  };

  return {
    funds,
    loading,
    error,
    filterFunds,
    getFundById,
    getFundsByManager,
    refetch: () => {
      // Placeholder for future real-time refetch
      setFunds([...staticFunds]);
    }
  };
};