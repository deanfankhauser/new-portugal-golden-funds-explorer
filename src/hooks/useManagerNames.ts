import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to fetch all unique manager names from the database
 * Used for autocomplete in fund editing to prevent typos
 */
export const useManagerNames = () => {
  return useQuery({
    queryKey: ['manager-names'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funds')
        .select('manager_name')
        .order('manager_name');
      
      if (error) throw error;
      
      // Extract unique manager names
      const uniqueNames = Array.from(
        new Set(data.map(fund => fund.manager_name).filter(Boolean))
      ).sort();
      
      return uniqueNames as string[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
